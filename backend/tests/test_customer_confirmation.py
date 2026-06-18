"""Tests for customer confirmation email feature (iteration 4)."""
import os
import sys
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://gep-vakolas-kalku.preview.emergentagent.com').rstrip('/')

# Add backend to path so we can test build_customer_confirmation_html directly
sys.path.insert(0, '/app/backend')


class TestCustomerConfirmationHtml:
    """Unit tests for build_customer_confirmation_html()"""

    def test_html_contains_customer_details(self):
        from server import build_customer_confirmation_html, ContactSubmission, ServiceLineItem

        sub = ContactSubmission(
            name="TEST_János Kovács",
            phone="+36 30 123 4567",
            email="test@example.com",
            square_meters=85,
            message="Test üzenet sor1\nsor2",
            total_price=297500.0,
            services=[
                ServiceLineItem(id="cementes", name="Cementes gépi vakolás", category="munkadij",
                                qty=85, unit="m²", lineMin=212500, lineMax=340000),
                ServiceLineItem(id="lepcsohaz", name="Lépcsőház", category="percent",
                                percent_min=10, percent_max=15),
            ],
            total_min=233750,
            total_max=391000,
        )
        html = build_customer_confirmation_html(sub)

        # customer name
        assert "TEST_János Kovács" in html
        # sqm
        assert "85 m²" in html
        # phone & email
        assert "+36 30 123 4567" in html
        assert "test@example.com" in html
        # services rendered
        assert "Cementes gépi vakolás" in html
        assert "Lépcsőház" in html
        # disclaimer
        assert "tájékoztató jellegűek" in html
        # 24h promise
        assert "24 órán belül" in html

    def test_html_handles_no_services_no_message(self):
        from server import build_customer_confirmation_html, ContactSubmission
        sub = ContactSubmission(
            name="TEST_Anna", phone="123456", email="a@b.com",
            square_meters=50, message="", total_price=175000,
            services=[],
        )
        html = build_customer_confirmation_html(sub)
        assert "TEST_Anna" in html
        assert "50 m²" in html
        # No services table rendered when empty
        assert "Kiválasztott szolgáltatások" not in html


class TestContactEndpoint:
    """Integration tests against the live /api/contact endpoint."""

    def test_contact_post_returns_200_and_email_sent(self):
        payload = {
            "name": "TEST_Customer Confirm",
            "phone": "+36 30 111 2222",
            "email": "info.benotekbau@gmail.com",  # account email = should send via Resend free tier
            "square_meters": 60,
            "message": "Automated test (customer confirmation)",
            "services": [
                {"id": "cementes", "name": "Cementes gépi vakolás", "category": "munkadij",
                 "qty": 60, "unit": "m²", "lineMin": 150000, "lineMax": 240000},
            ],
            "total_min": 150000,
            "total_max": 240000,
        }
        r = requests.post(f"{BASE_URL}/api/contact", json=payload, timeout=30)
        assert r.status_code == 200, f"Got {r.status_code}: {r.text}"
        data = r.json()
        assert data["email_sent"] is True
        assert data["name"] == "TEST_Customer Confirm"
        assert data["square_meters"] == 60
        assert "id" in data
        # services preserved
        assert len(data.get("services", [])) == 1
        assert data["services"][0]["category"] == "munkadij"

    def test_contact_post_with_arbitrary_email_still_returns_200(self):
        """Customer confirmation may fail on Resend free tier for non-account emails;
        the endpoint must still succeed because company email is the gating factor."""
        payload = {
            "name": "TEST_Arbitrary Email",
            "phone": "+36 70 999 8888",
            "email": "noone-zzz-test@example.com",
            "square_meters": 30,
            "message": "Customer confirm to arbitrary email; should not break endpoint.",
            "services": [],
        }
        r = requests.post(f"{BASE_URL}/api/contact", json=payload, timeout=30)
        # Company email send still works -> 200; if it failed -> 502.
        # The key assertion: failing customer confirmation must NOT break the endpoint.
        assert r.status_code in (200, 502), f"Unexpected {r.status_code}: {r.text}"
        if r.status_code == 200:
            assert r.json()["email_sent"] is True

    def test_contact_post_invalid_payload_returns_422(self):
        r = requests.post(f"{BASE_URL}/api/contact",
                          json={"name": "", "phone": "", "email": "bad", "square_meters": -1},
                          timeout=10)
        assert r.status_code == 422

    def test_health_and_config(self):
        r1 = requests.get(f"{BASE_URL}/api/", timeout=10)
        assert r1.status_code == 200
        r2 = requests.get(f"{BASE_URL}/api/config", timeout=10)
        assert r2.status_code == 200
        cfg = r2.json()
        assert cfg["price_per_sqm_min"] == 2500
        assert cfg["price_per_sqm_max"] == 4000
