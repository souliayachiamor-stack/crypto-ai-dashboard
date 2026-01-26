# crypto-ai-dashboard
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, ShieldAlert } from "lucide-react";

export default function CryptoDashboard() {
  const asset = {
    name: "Ethereum",
    score: 82,
    recommendation: "استثمار جيد",
    risk: "متوسط",
    breakdown: {
      fundamentals: 34,
      adoption: 16,
      valuation: 12,
      sentiment: 12,
      risk: 8,
    },
    thesis:
      "يُظهر مشروع Ethereum أساسيات قوية على المدى الطويل، مدعومة بنشاط تطوير مرتفع واعتماد واسع في تطبيقات DeFi وNFT. بالرغم من وجود مخاطر تنظيمية متوسطة، إلا أن النمو المستدام يجعل المشروع مناسبًا للاستثمار متوسط إلى طويل الأجل.",
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Asset Overview */}
      <Card className="md:col-span-1">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold">{asset.name}</h2>
          <div className="text-5xl font-extrabold text-green-500">
            {asset.score}
          </div>
          <Badge variant="outline" className="text-lg">
            {asset.recommendation}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldAlert size={16} /> مستوى المخاطر: {asset.risk}
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <Card className="md:col-span-2">
        <CardContent className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp size={18} /> توزيع التقييم الاستثماري
          </h3>

          {Object.entries(asset.breakdown).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize">{key}</span>
                <span>{value}</span>
              </div>
              <Progress value={value * 2.5} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Investment Thesis */}
      <Card className="md:col-span-3">
        <CardContent className="space-y-3">
          <h3 className="text-xl font-semibold">🧠 AI Investment Thesis</h3>
          <p className="text-muted-foreground leading-relaxed">
            {asset.thesis}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

