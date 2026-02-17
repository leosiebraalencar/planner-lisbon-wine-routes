import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Download, LogOut } from "lucide-react";

interface QuizSubmission {
  id: string;
  customerName: string;
  customerEmail: string | null;
  marketingConsent: string | null;
  quizData: any;
  language: string | null;
  createdAt: string;
}

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        const subRes = await fetch("/api/admin/submissions", {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        const subs = await subRes.json();
        setSubmissions(subs);
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "ID", "Nome", "Email", "Consentimento Marketing", "Idioma",
      "Duração", "Orçamento", "Viajantes", "Tamanho Grupo",
      "Idioma Experiência", "Preferências", "Chegada",
      "Aluguer Carro", "Guia Privado", "Alojamento", "Preferência Alojamento",
      "Pedidos Especiais", "Data Início", "Data Fim", "Data Criação"
    ];

    const rows = submissions.map(s => {
      const q = s.quizData || {};
      return [
        s.id,
        s.customerName,
        s.customerEmail || "",
        s.marketingConsent || "false",
        s.language || "PT",
        q.duration || "",
        q.budget || "",
        q.travelers || "",
        q.groupSize || "",
        q.languagePreference || "",
        (q.preferences || []).join("; "),
        q.arrival || "",
        q.needsCarRental ? "Sim" : "Não",
        q.wantsPrivateGuide ? "Sim" : "Não",
        q.hasAccommodation ? "Sim" : "Não",
        q.accommodationPreference || "",
        q.specialRequests || "",
        q.startDate || "",
        q.endDate || "",
        s.createdAt ? new Date(s.createdAt).toLocaleString("pt-PT") : "",
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-submissions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <CardTitle>Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-admin-email"
                />
              </div>
              <div>
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-admin-password"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading} data-testid="button-admin-login">
                {loading ? "..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h1 className="text-2xl font-bold">Quiz Submissions ({submissions.length})</h1>
          <div className="flex items-center gap-2">
            <Button onClick={handleExportCSV} variant="outline" data-testid="button-export-csv">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
            <Button variant="ghost" size="icon" onClick={() => { setToken(null); setSubmissions([]); }} data-testid="button-admin-logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium">Nome</th>
                <th className="text-left p-3 font-medium">Email</th>
                <th className="text-left p-3 font-medium">Consent</th>
                <th className="text-left p-3 font-medium">Duração</th>
                <th className="text-left p-3 font-medium">Orçamento</th>
                <th className="text-left p-3 font-medium">Viajantes</th>
                <th className="text-left p-3 font-medium">Preferências</th>
                <th className="text-left p-3 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} className="border-b border-border" data-testid={`row-submission-${s.id}`}>
                  <td className="p-3">{s.customerName}</td>
                  <td className="p-3">{s.customerEmail || "-"}</td>
                  <td className="p-3">{s.marketingConsent === "true" ? "Sim" : "Não"}</td>
                  <td className="p-3">{s.quizData?.duration || "-"} dias</td>
                  <td className="p-3">{s.quizData?.budget || "-"}</td>
                  <td className="p-3">{s.quizData?.travelers || "-"}{s.quizData?.groupSize ? ` (${s.quizData.groupSize})` : ""}</td>
                  <td className="p-3 max-w-[200px] truncate">{(s.quizData?.preferences || []).join(", ")}</td>
                  <td className="p-3 whitespace-nowrap">{s.createdAt ? new Date(s.createdAt).toLocaleDateString("pt-PT") : "-"}</td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-muted-foreground">
                    Nenhuma submissão encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
