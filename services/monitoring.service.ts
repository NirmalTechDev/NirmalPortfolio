import { healthService } from "./health.service";

export const monitoringService = {
  async getServices() {
    return healthService.checkServices();
  },

  async getLatencyHistory() {
    return healthService.getLatencyTrend();
  },

  async getLogs() {
    return healthService.fetchSystemLogs();
  },
};
