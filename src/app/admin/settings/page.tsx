import { CategoriesManager } from '../opportunity-categories/CategoriesManager';
import { OrganizersManager } from '../organizers/OrganizersManager';
import { CountriesManager } from '../locations/CountriesManager';
import { StatesManager } from '../locations/StatesManager';
import { CitiesManager } from '../locations/CitiesManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminSettingsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="organizers">Organizers</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>
        <TabsContent value="categories">
          <CategoriesManager />
        </TabsContent>
        <TabsContent value="organizers">
          <OrganizersManager />
        </TabsContent>
        <TabsContent value="locations">
          <Tabs defaultValue="countries">
            <TabsList>
              <TabsTrigger value="countries">Countries</TabsTrigger>
              <TabsTrigger value="states">States</TabsTrigger>
              <TabsTrigger value="cities">Cities</TabsTrigger>
            </TabsList>
            <TabsContent value="countries">
              <CountriesManager />
            </TabsContent>
            <TabsContent value="states">
              <StatesManager />
            </TabsContent>
            <TabsContent value="cities">
              <CitiesManager />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}