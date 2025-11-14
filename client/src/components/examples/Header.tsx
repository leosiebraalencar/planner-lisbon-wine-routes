import Header from '../Header';

export default function HeaderExample() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-4">Normal Header:</p>
        <Header />
      </div>
      <div className="relative h-48 bg-gradient-to-r from-primary to-primary/70">
        <p className="text-sm text-white p-4">Transparent Header (over image):</p>
        <Header transparent />
      </div>
    </div>
  );
}
