import FormInput from "../ui/FormInput";
import FormSelect from "../ui/FormSelect";
import PhoneInput from "../ui/PhoneInput";

export default function CustomerFields({ value, onChange }) {
  function updateField(field, fieldValue) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormInput
        label="First name"
        value={value.firstName}
        onChange={(fieldValue) => updateField("firstName", fieldValue)}
      />

      <FormInput
        label="Last name"
        value={value.lastName}
        onChange={(fieldValue) => updateField("lastName", fieldValue)}
      />

      <PhoneInput
        label="Phone"
        value={value.phone}
        onChange={(fieldValue) => updateField("phone", fieldValue)}
        defaultCountry="AU"
      />

      <FormInput
        label="Email"
        value={value.email}
        onChange={(fieldValue) => updateField("email", fieldValue)}
      />

      <FormSelect
        label="Preferred contact"
        value={value.preferredContact}
        onChange={(fieldValue) => updateField("preferredContact", fieldValue)}
        options={[
          ["whatsapp", "WhatsApp"],
          ["phone", "Phone"],
          ["email", "Email"],
        ]}
      />
    </div>
  );
}
