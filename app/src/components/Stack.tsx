import { Button } from "./ui/button";

interface StackProps {
  stack: number;
  isGameStarted: boolean;
  onChange: () => void;
}

const Stack = (props: StackProps) => {
  const { stack, isGameStarted, onChange } = props;

  return (
    <div className="flex flex-row justify-between items-center gap-4 ">
      <h1 className="text-2xl font-bold text-black">Stacks</h1>

      <div className="flex gap-4">
        {/* Stack Button */}
        <Button
          className="px-8 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transform transition-transform duration-200 ease-in-out hover:scale-105"
          variant="outline"
        >
          {stack}
        </Button>

        {/* Apply Button */}
        <Button
          className="px-8 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transform transition-transform duration-200 ease-in-out hover:scale-105"
          variant="outline"
        >
          Apply
        </Button>

        {/* Reset/Start Button */}
        <Button
          className={`px-8 py-2 text-white font-semibold rounded-lg shadow-md transform transition-transform duration-200 ease-in-out hover:scale-105 ${
            isGameStarted
              ? "bg-red-700 hover:bg-red-600"
              : "bg-green-700 hover:bg-green-600"
          }`}
          variant="outline"
          onClick={() => onChange()}
        >
          {isGameStarted ? "Reset" : "Start"}
        </Button>
      </div>
    </div>
  );
};

export default Stack;
