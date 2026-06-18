"""Backend tests for BENOTEK-BAU API (iteration 2)"""
import os
import requests
import pytest

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:3000').rstrip('/')
# fallback to frontend env
if 'localhost' in BASE_URL:
    # read from frontend/.env
    try:
        with open('/app/frontend/.env') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    BASE_URL = line.split('=', 1)[1].strip().strip('"').rstrip('/')
    except Exception:
        pass

API = f"{BASE_URL}/api"


# --- /api/config ---
def test_config_returns_price_ranges():
    r = requests.get(f"{API}/config", timeout=15)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["price_per_sqm_min"] == 2500
    assert data["price_per_sqm_max"] == 4000
    assert data["company"] == "BENOTEK-BAU Kft."
    assert data["email"] == "info.benotekbau@gmail.com"


# --- /api/contact valid ---
def test_contact_valid_payload_sends_email_and_persists():
    payload = {
        "name": "TEST_Tester",
        "phone": "+36301234567",
        "email": "test@example.com",
        "square_meters": 50,
        "message": "TEST run iteration 2",
    }
    r = requests.post(f"{API}/contact", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["email_sent"] is True
    assert data["name"] == "TEST_Tester"
    assert data["square_meters"] == 50
    assert data["total_price"] == 50 * 3500
    assert "id" in data

    # Verify persistence
    lr = requests.get(f"{API}/contact/submissions?limit=10", timeout=15)
    assert lr.status_code == 200
    ids = [s["id"] for s in lr.json()]
    assert data["id"] in ids


# --- /api/contact invalid ---
def test_contact_invalid_email_returns_422():
    r = requests.post(f"{API}/contact", json={
        "name": "X",
        "phone": "+36301234567",
        "email": "not-an-email",
        "square_meters": 10,
    }, timeout=15)
    assert r.status_code == 422


def test_contact_missing_fields_returns_422():
    r = requests.post(f"{API}/contact", json={
        "name": "",
        "email": "x@y.com",
    }, timeout=15)
    assert r.status_code == 422


def test_contact_negative_sqm_returns_422():
    r = requests.post(f"{API}/contact", json={
        "name": "Test",
        "phone": "+36301234567",
        "email": "test@example.com",
        "square_meters": -5,
    }, timeout=15)
    assert r.status_code == 422
