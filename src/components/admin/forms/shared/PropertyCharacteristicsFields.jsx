import FormSelect from "@/components/admin/forms/ui/FormSelect";

export default function PropertyCharacteristicsFields({ value, onChange }) {
  function updateField(field, fieldValue) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <FormSelect
        label="Property Type"
        value={value.propertyType || ""}
        onChange={(fieldValue) => updateField("propertyType", fieldValue)}
        options={[
          ["apartment", "Apartment"],
          ["house", "House"],
          ["townhouse", "Townhouse"],
          ["office", "Office"],
          ["other", "Other"],
        ]}
      />

      <FormSelect
        label="Floors"
        value={value.floors || ""}
        onChange={(fieldValue) => updateField("floors", fieldValue)}
        options={[
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4+", "4+"],
        ]}
      />

      <FormSelect
        label="Bedrooms"
        value={value.bedrooms || ""}
        onChange={(fieldValue) => updateField("bedrooms", fieldValue)}
        options={[
          ["0", "0"],
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4", "4"],
          ["5+", "5+"],
        ]}
      />

      <FormSelect
        label="Bathrooms"
        value={value.bathrooms || ""}
        onChange={(fieldValue) => updateField("bathrooms", fieldValue)}
        options={[
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4", "4"],
          ["5+", "5+"],
        ]}
      />

      <FormSelect
        label="Kitchens"
        value={value.kitchens || ""}
        onChange={(fieldValue) => updateField("kitchens", fieldValue)}
        options={[
          ["0", "0"],
          ["1", "1"],
          ["2", "2"],
          ["3+", "3+"],
        ]}
      />

      <FormSelect
        label="Balconies"
        value={value.balconies || ""}
        onChange={(fieldValue) => updateField("balconies", fieldValue)}
        options={[
          ["0", "0"],
          ["1", "1"],
          ["2", "2"],
          ["3+", "3+"],
        ]}
      />

      <FormSelect
        label="Laundries"
        value={value.laundries || ""}
        onChange={(fieldValue) => updateField("laundries", fieldValue)}
        options={[
          ["0", "0"],
          ["1", "1"],
          ["2+", "2+"],
        ]}
      />

      <FormSelect
        label="Pets"
        value={value.pets || ""}
        onChange={(fieldValue) => updateField("pets", fieldValue)}
        options={[
          ["no", "No"],
          ["yes", "Yes"],
        ]}
      />
    </div>
  );
}
