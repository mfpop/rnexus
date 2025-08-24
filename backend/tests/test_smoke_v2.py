from django.test import Client, TestCase


class SmokeTests(TestCase):
    def setUp(self) -> None:
        self.client = Client()

    def test_health(self):
        resp = self.client.get("/api/health/")
        assert resp.status_code == 200

    def test_v2_activities_list(self):
        resp = self.client.get("/api/v2/activities/")
        assert resp.status_code == 200
