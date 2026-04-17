"use client"
import React, { useState } from "react";

export default function DeployButton() {
  const [deployStatus, setDeployStatus] = useState("idle"); // idle, deploying, success, error
  const [hasDeployed, setHasDeployed] = useState(false);
  const [message, setMessage] = useState("");

  const DEPLOY_HOOK_URL =
    "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/73859536-d035-4db9-b2f8-a9055bca3940";

  const handleDeploy = async () => {
    // Prevent multiple deployments
    if (hasDeployed) {
      setMessage("Already deployed! Reload the page to deploy again.");
      return;
    }

    setDeployStatus("deploying");
    setMessage("Deploying...");

    try {
      const response = await fetch(DEPLOY_HOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setDeployStatus("success");
        setMessage("✅ Deployment triggered successfully!");
        setHasDeployed(true);
      } else {
        throw new Error("Deploy failed");
      }
    } catch (error) {
      setDeployStatus("error");
      setMessage("❌ Deployment failed. Please try again later.");
      console.error("Deploy error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
         Update Now
        </h1>

        <button
          onClick={handleDeploy}
          disabled={deployStatus === "deploying" || hasDeployed}
          className={`
            px-8 py-4 rounded-lg font-semibold text-white text-lg
            transition-all duration-200 transform
            ${
              hasDeployed
                ? "bg-gray-400 cursor-not-allowed"
                : deployStatus === "deploying"
                  ? "bg-blue-400 cursor-wait"
                  : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            }
          `}
        >
          {deployStatus === "deploying" && (
            <span className="inline-block mr-2">
              <svg
                className="animate-spin h-5 w-5 inline"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
          )}
          {hasDeployed
            ? "Updated"
            : deployStatus === "deploying"
              ? "Updating..."
              : "Update"}
        </button>

        {message && (
          <p
            className={`
            text-sm font-medium mt-4
            ${deployStatus === "success" ? "text-green-600" : ""}
            ${deployStatus === "error" ? "text-red-600" : ""}
            ${hasDeployed && deployStatus === "idle" ? "text-gray-600" : ""}
          `}
          >
            {message}
          </p>
        )}

        {hasDeployed && (
          <p className="text-xs text-gray-500 mt-2">
            Refresh the page to deploy again
          </p>
        )}
      </div>
    </div>
  );
}
