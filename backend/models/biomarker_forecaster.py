"""
Longitudinal Biomarker Forecasting Engine
Tracks patient biomarker time-series history and projects future 3-month and 6-month trajectories.
"""

from typing import List, Dict, Any, Optional
import numpy as np
from datetime import datetime


class BiomarkerForecaster:
    def __init__(self):
        # Reference clinical velocity limits (safe delta thresholds per month)
        self.biomarker_thresholds = {
            "hba1c": {"unit": "%", "max_safe_monthly_increase": 0.1, "target": 5.7},
            "glucose": {"unit": "mg/dL", "max_safe_monthly_increase": 3.0, "target": 99.0},
            "total cholesterol": {"unit": "mg/dL", "max_safe_monthly_increase": 4.0, "target": 190.0},
            "ldl": {"unit": "mg/dL", "max_safe_monthly_increase": 3.0, "target": 100.0},
            "triglycerides": {"unit": "mg/dL", "max_safe_monthly_increase": 5.0, "target": 150.0},
            "hemoglobin": {"unit": "g/dL", "max_safe_monthly_increase": 0.2, "target": 14.0},
            "creatinine": {"unit": "mg/dL", "max_safe_monthly_increase": 0.05, "target": 1.0}
        }

    def forecast_trajectory(self, history: List[Dict[str, Any]], biomarker_name: str) -> Dict[str, Any]:
        """
        Takes an array of history entries: [{'date': '2024-01-15', 'value': 6.2}, ...]
        Computes rate of change, 3-month forecast, 6-month forecast, and trajectory severity.
        """
        b_key = biomarker_name.lower().strip()
        
        if len(history) < 2:
            current_val = history[0]["value"] if history else 0.0
            return {
                "biomarker": biomarker_name,
                "currentValue": current_val,
                "insufficientData": True,
                "message": "At least 2 historical lab points are required to compute longitudinal trajectory.",
                "forecast": []
            }

        # Parse timestamps & sort
        parsed_points = []
        for p in history:
            try:
                dt = datetime.strptime(p["date"], "%Y-%m-%d")
            except ValueError:
                try:
                    dt = datetime.strptime(p["date"], "%d/%m/%Y")
                except ValueError:
                    dt = datetime.now()
            parsed_points.append((dt, float(p["value"])))

        parsed_points.sort(key=lambda x: x[0])
        
        base_time = parsed_points[0][0]
        # Days from start
        days = np.array([(p[0] - base_time).days for p in parsed_points], dtype=float)
        values = np.array([p[1] for p in parsed_points], dtype=float)

        # Fit linear regression trend line
        if days[-1] == days[0]:
            slope = 0.0
            intercept = values[-1]
        else:
            slope, intercept = np.polyfit(days, values, 1)

        monthly_velocity = round(float(slope * 30.4), 2)  # delta per month
        last_date = parsed_points[-1][0]
        last_val = values[-1]

        # Forecast 90 days (3 months) and 180 days (6 months)
        pred_3m = round(float(last_val + (slope * 90)), 2)
        pred_6m = round(float(last_val + (slope * 180)), 2)

        # Check trajectory clinical classification
        threshold_info = self.biomarker_thresholds.get(b_key, {"unit": "", "max_safe_monthly_increase": 0.5, "target": last_val})
        max_safe = threshold_info["max_safe_monthly_increase"]

        if monthly_velocity > max_safe:
            trend_status = "RAPIDLY_WORSENING"
            trend_label = f"Worsening (+{monthly_velocity} {threshold_info['unit']}/mo)"
        elif monthly_velocity > 0:
            trend_status = "SLIGHT_INCREASE"
            trend_label = f"Slight Rise (+{monthly_velocity} {threshold_info['unit']}/mo)"
        elif monthly_velocity < -max_safe:
            trend_status = "RAPIDLY_IMPROVING"
            trend_label = f"Substantial Improvement ({monthly_velocity} {threshold_info['unit']}/mo)"
        elif monthly_velocity < 0:
            trend_status = "IMPROVING"
            trend_label = f"Gradual Improvement ({monthly_velocity} {threshold_info['unit']}/mo)"
        else:
            trend_status = "STABLE"
            trend_label = "Stable Baseline (No drift)"

        forecast_points = [
            {"period": "Current", "value": round(float(last_val), 2), "confidenceLower": round(float(last_val), 2), "confidenceUpper": round(float(last_val), 2)},
            {"period": "+3 Months (Projected)", "value": max(0.0, pred_3m), "confidenceLower": round(max(0.0, pred_3m * 0.95), 2), "confidenceUpper": round(pred_3m * 1.05, 2)},
            {"period": "+6 Months (Projected)", "value": max(0.0, pred_6m), "confidenceLower": round(max(0.0, pred_6m * 0.90), 2), "confidenceUpper": round(pred_6m * 1.10, 2)},
        ]

        return {
            "biomarker": biomarker_name,
            "currentValue": round(float(last_val), 2),
            "unit": threshold_info["unit"],
            "monthlyVelocity": monthly_velocity,
            "trendStatus": trend_status,
            "trendLabel": trend_label,
            "clinicalTarget": threshold_info["target"],
            "forecast": forecast_points,
            "insights": f"Based on your {len(history)} historical readings, {biomarker_name} exhibits a {trend_label.lower()} trajectory."
        }


# Singleton instance
biomarker_forecaster = BiomarkerForecaster()
