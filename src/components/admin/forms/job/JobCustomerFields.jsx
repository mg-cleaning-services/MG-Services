import FormInput from "../ui/FormInput";

export default function JobCustomerFields({ value, onChange }) {
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

      <FormInput
        label="Phone"
        value={value.phone}
        onChange={(fieldValue) => updateField("phone", fieldValue)}
      />

      <FormInput
        label="Email"
        value={value.email}
        onChange={(fieldValue) => updateField("email", fieldValue)}
      />
    </div>
  );
}
