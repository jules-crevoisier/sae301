import { FormInput, Card } from "../ui/FormElements";
import { MapPin, Phone, Mail, Building } from "lucide-react";

export default function FamilyStep({ data, errors, onChange }) {
  return (
    <Card>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Adresse postale"
            placeholder="12 rue des écoles"
            value={data.address_line1}
            onChange={(e) => onChange('address_line1', e.target.value)}
            error={errors.address_line1}
            icon={MapPin}
            required
          />
           <FormInput
            label="Complément"
            placeholder="Bâtiment A..."
            value={data.address_line2 || ''}
            onChange={(e) => onChange('address_line2', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormInput
            label="Code Postal"
            placeholder="10320"
            value={data.postal_code}
            onChange={(e) => onChange('postal_code', e.target.value)}
            error={errors.postal_code}
            maxLength={5}
          />
          <FormInput
            label="Ville"
            placeholder="Bouilly"
            value={data.city}
            onChange={(e) => onChange('city', e.target.value)}
            error={errors.city}
            icon={Building}
          />
        </div>

        <div className="h-px bg-gray-100 my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Email de contact"
            type="email"
            placeholder="famille@exemple.com"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            error={errors.email}
            icon={Mail}
          />
          <FormInput
            label="Téléphone principal"
            type="tel"
            placeholder="06 12 34 56 78"
            value={data.phone_primary}
            onChange={(e) => onChange('phone_primary', e.target.value)}
            error={errors.phone_primary}
            icon={Phone}
          />
        </div>
      </div>
    </Card>
  );
}