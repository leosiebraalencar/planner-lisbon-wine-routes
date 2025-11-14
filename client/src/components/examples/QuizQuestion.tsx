import QuizQuestion from '../QuizQuestion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function QuizQuestionExample() {
  return (
    <div className="p-8 bg-background min-h-screen flex items-center">
      <QuizQuestion
        questionNumber={1}
        totalQuestions={6}
        question="Quantos dias durará sua viagem?"
        onNext={() => console.log('Next clicked')}
        onBack={() => console.log('Back clicked')}
        canGoNext={true}
        canGoBack={false}
      >
        <RadioGroup defaultValue="3">
          {[1, 2, 3, 4, 5, '6+'].map((day) => (
            <div key={day} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover-elevate active-elevate-2 cursor-pointer">
              <RadioGroupItem value={String(day)} id={`day-${day}`} />
              <Label htmlFor={`day-${day}`} className="cursor-pointer flex-1">
                {day === '6+' ? '6 dias ou mais' : `${day} ${day === 1 ? 'dia' : 'dias'}`}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </QuizQuestion>
    </div>
  );
}
