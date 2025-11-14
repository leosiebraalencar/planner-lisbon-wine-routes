import Hero from '../Hero';

export default function HeroExample() {
  return <Hero onStartQuiz={() => console.log('Start quiz clicked')} />;
}
