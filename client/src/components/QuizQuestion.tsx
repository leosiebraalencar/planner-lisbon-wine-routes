import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuizQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  canGoNext: boolean;
  canGoBack: boolean;
}

export default function QuizQuestion({
  questionNumber,
  totalQuestions,
  question,
  children,
  onNext,
  onBack,
  canGoNext,
  canGoBack
}: QuizQuestionProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto border-border">
      <CardContent className="p-8">
        <div className="mb-6">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
            {String(questionNumber).padStart(2, '0')}/{String(totalQuestions).padStart(2, '0')}
          </div>
          <h2 className="font-serif font-bold text-2xl md:text-3xl mb-6">
            {question}
          </h2>
        </div>
        
        <div className="mb-8">
          {children}
        </div>
        
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={!canGoBack}
            data-testid="button-back"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={onNext}
            disabled={!canGoNext}
            data-testid="button-next"
          >
            {questionNumber === totalQuestions ? 'Gerar Roteiro' : 'Próximo'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
