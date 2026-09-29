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

  async function generateCleanerCard(employee) {
    if (!employee?.id) {
      return null;
    }

    const fullEmployee = await getEmployeeById(employee.id);

    if (!fullEmployee) {
      console.error("Employee not found.");
      return null;
    }

    setIntroductionEmployee(fullEmployee);

    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );

    if (!cleanerCardRef.current) {
      return null;
    }

    const dataUrl = await toPng(cleanerCardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
    });

    const employeeName = fullEmployee.name.toLowerCase().replace(/\s+/g, "-");

    const fileName = `${employeeName}-mg-cleaning.png`;
    const blob = dataUrlToBlob(dataUrl);

    return {
      fullEmployee,
      fileName,
      blob,
    };
  }

  async function downloadCleanerCard(employee) {
    try {
      const card = await generateCleanerCard(employee);

      if (!card) {
        return;
      }

      const objectUrl = URL.createObjectURL(card.blob);

      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = card.fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Error downloading cleaner introduction:", error);
    }
  }

  async function shareCleanerCard(employee) {
    try {
      const card = await generateCleanerCard(employee);

      if (!card) {
        return;
      }

      const file = new File([card.blob], card.fileName, {
        type: "image/png",
      });

      if (!navigator.share || !navigator.canShare?.({ files: [file] })) {
        alert("Sharing images is not supported on this device.");
        return;
      }

      await navigator.share({
        files: [file],
        title: `${card.fullEmployee.name} - MG Cleaning`,
      });
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }

      console.error("Error sharing cleaner introduction:", error);
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
    shareCleanerCard,
    clearIntroductionEmployee,
  };
}

function dataUrlToBlob(dataUrl) {
  const [header, data] = dataUrl.split(",");

  const mimeMatch = header.match(/data:(.*?);base64/);
  const mimeType = mimeMatch?.[1] || "image/png";

  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], {
    type: mimeType,
  });
}
