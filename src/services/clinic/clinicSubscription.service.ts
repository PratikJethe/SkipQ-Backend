import moment, { Moment } from "moment";

class ClinicSubscriptionClass {

    
  generateStartEndDate(months: number) {
    let currentDate: Date = new Date();
    let endDate: Moment = moment().add(months, "months");

    return {
      subStartDate: currentDate.toISOString(),
      subEndDate: endDate.toISOString()
    };
  }
}

export const clinicSubscriptionService = new ClinicSubscriptionClass();
