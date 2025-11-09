import { CountriesManager } from './CountriesManager';
import { StatesManager } from './StatesManager';
import { CitiesManager } from './CitiesManager';

export default function AdminLocationsPage() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Countries</h1>
        <CountriesManager />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-4">States</h1>
        <StatesManager />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-4">Cities</h1>
        <CitiesManager />
      </div>
    </div>
  );
}
