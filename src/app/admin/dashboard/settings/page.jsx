"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSettings, setLoadingSetting] = useState(false);
  const [settings, setSettings] = useState({
    google_verification_code: "",
    google_analytics_id: "",
    google_adsense_id: "",
    meta_description: "",
    meta_keywords: "",
    site_title: "",
  });

  useEffect(() => {
    const getSettings = async () => {
      setLoadingSetting(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings`
      );
      const data = {};
      res.data.forEach((setting) => {
        data[setting.key] = setting.value;
      });
      setSettings(data);
      setLoadingSetting(false);
    };

    // const localPerms = JSON.parse(localStorage.getItem("permissions") || "[]");
    const hasPermission = localStorage.getItem("role") === "admin";
    setAllowed(hasPermission);
    if (hasPermission) getSettings();
  }, []);

  if (!allowed) {
    return (
      <p className="text-red-500">
        You don’t have permission to view this page.
      </p>
    );
  }

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true); // start spinner
    try {
      axios.defaults.withCredentials = true;
      axios.defaults.withXSRFToken = true;
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings`,
        settings
      );
      toast("Settings saved!");
    } catch (err) {
      console.error(err);
      toast("Failed to save settings");
    } finally {
      setLoading(false); // stop spinner
    }
  };

  if (!allowed) {
    return (
      <p className="text-red-500 text-center mt-10">
        🚫 You don’t have permission to view this page.
      </p>
    );
  }

  return (
    <>
      {loadingSettings ? (
        <div className="flex justify-center items-center p-6">
          <Loader2 className="animate-spin mr-2" />
        </div>
      ) : (
        <div className="p-6 max-w-3xl w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {[
                "site_title",
                "meta_description",
                "meta_keywords",
                "google_verification_code",
                "google_analytics_id",
                "google_adsense_id",
              ].map((key) => (
                <div key={key} className="space-y-1">
                  <Label htmlFor={key}>{key.replace(/_/g, " ")}</Label>
                  <Input
                    id={key}
                    name={key}
                    value={settings[key] || ""}
                    onChange={handleChange}
                  />
                </div>
              ))}

              <Button onClick={handleSave} className="mt-4" disabled={loading}>
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : null}
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}