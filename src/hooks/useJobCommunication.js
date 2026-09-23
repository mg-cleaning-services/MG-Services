import { useRef, useState } from "react";

import { toPng } from "html-to-image";

import {
  buildCleanerJobMessage,
  buildCustomerCleanerMessage,
  createWhatsAppUrl,
} from "@/services/communicationService";

import { getEmployeeById } from "@/services/employeeService";

export default function useJobCommunication(job) {
  const [introductionEmployee, setIntroductionEmployee] = useState(null);

  const cleanerCardRef = useRef(null);

  async function sendJobToCleaner(employee) {
    if (!employee?.phone) {
      alert("This employee does not have a phone number.");
      return;
    }

    try {
      const message = await buildCleanerJobMessage(job);

      const whatsappUrl = createWhatsAppUrl(employee.phone, message);

      if (!whatsappUrl) {
        return;
      }

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error preparing cleaner WhatsApp message:", error);
      alert("Unable to prepare the cleaner message.");
    }
  }

  async function sendCleanerToCustomer(employee) {
    if (!employee) {
      return;
    }

    if (!job?.customer?.phone) {
      alert("This customer does not have a phone number.");
      return;
    }

    try {
      const message = await buildCustomerCleanerMessage(job, employee);

      const whatsappUrl = createWhatsAppUrl(job.customer.phone, message);

      if (!whatsappUrl) {
        return;
      }

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error preparing customer WhatsApp message:", error);
      alert("Unable to prepare the customer message.");
    }
  }

  async function downloadCleanerCard(employee) {
    if (!employee?.id) {
      return;
    }

    try {
      const fullEmployee = await getEmployeeById(employee.id);

      if (!fullEmployee) {
        console.error("Employee not found.");
        return;
      }

      setIntroductionEmployee(fullEmployee);

      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );

      if (!cleanerCardRef.current) {
        return;
      }

      const dataUrl = await toPng(cleanerCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement("a");

      const employeeName = fullEmployee.name.toLowerCase().replace(/\s+/g, "-");

      link.download = `${employeeName}-mg-cleaning.png`;
      link.href = dataUrl;

      link.click();
    } catch (error) {
      console.error("Error generating cleaner introduction:", error);
    }
  }

  function clearIntroductionEmployee(employeeId) {
    setIntroductionEmployee((current) => {
      if (current && String(current.id) === String(employeeId)) {
        return null;
      }

      return current;
    });
  }

  return {
    introductionEmployee,
    cleanerCardRef,

    sendJobToCleaner,
    sendCleanerToCustomer,
    downloadCleanerCard,
    clearIntroductionEmployee,
  };
}
