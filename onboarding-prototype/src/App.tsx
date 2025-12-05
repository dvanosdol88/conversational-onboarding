import React, { useState, useEffect } from 'react';
import { useDialogue } from './hooks/useDialogue';
import { chapter1Data } from './data/chapter1';
import chapter2DataRaw from './data/chapter2.json';
import type { ChapterData } from './engine/types';

// Components
import { ChatContainer } from './components/ChatContainer';
import { ProgressTracker } from './components/ProgressTracker';
import { TextInput } from './components/TextInput';
import { NumberInput } from './components/NumberInput';
import { TextArea } from './components/TextArea';
import { ChoiceButtons } from './components/ChoiceButtons';
import { MultiInputForm } from './components/MultiInputForm';
import { ContinueButton } from './components/ContinueButton';

const chapter2Data = chapter2DataRaw as unknown as ChapterData;

function App() {
  // Cast the imported JSON to ChapterData to ensure types match
  const data = chapter1Data as unknown as ChapterData;

  const {
    state,
    currentNode,
    submitInput,
    selectOption,
    submitMultiInput,
    loadChapter
  } = useDialogue(data);

  const [inputValue, setInputValue] = useState<string | number>('');

  // Reset input value when node changes
  useEffect(() => {
    setInputValue('');
  }, [currentNode?.id]);



  // Calculate progress (rough estimate based on message count)
  const isChapter2 = currentNode?.id?.startsWith('c2_');
  const progress = state.messageHistory.filter(m => {
    if (m.speaker !== 'user') return false;
    if (isChapter2) {
      return m.nodeId?.startsWith('c2_');
    }
    return !m.nodeId?.startsWith('c2_');
  }).length;

  // Dynamic total based on current chapter
  const estimatedTotal = isChapter2 ? 25 : 15;
  const currentChapterTitle = isChapter2 ? chapter2Data.chapter.title : data.chapter.title;
  const currentChapterMinutes = isChapter2 ? chapter2Data.chapter.estimatedMinutes : data.chapter.estimatedMinutes;

  const handleContinue = () => {
    if (currentNode?.type === 'input') {
      submitInput(inputValue, currentNode.setsVariable);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid()) {
      handleContinue();
    }
  };

  // Validation logic for the current single input
  const isValid = () => {
    if (!currentNode || currentNode.type !== 'input') return false;

    const { validation } = currentNode;
    if (!validation) return true;

    if (validation.required && !inputValue) return false;

    if (typeof inputValue === 'string') {
      if (validation.minLength && inputValue.length < validation.minLength) return false;
      if (validation.maxLength && inputValue.length > validation.maxLength) return false;
    }

    if (typeof inputValue === 'number' || (typeof inputValue === 'string' && !isNaN(Number(inputValue)))) {
      const num = Number(inputValue);
      if (validation.min !== undefined && num < validation.min) return false;
      if (validation.max !== undefined && num > validation.max) return false;
    }

    return true;
  };

  // Render the appropriate input component
  const renderInputArea = () => {
    if (state.isComplete) {
      if (currentNode?.type === 'ai_message' && currentNode.nextChapter === 'chapter_2') {
        return (
          <div className="flex justify-center p-4">
            <ContinueButton
              onClick={() => loadChapter(chapter2Data)}
              label="Continue to Chapter 2"
            />
          </div>
        );
      }

      return (
        <div className="text-center p-4 text-gray-500">
          Chapter completed.
        </div>
      );
    }

    if (!currentNode || !state.isWaitingForInput) {
      return <div className="h-16" />; // Placeholder to prevent jump
    }

    if (currentNode.type === 'choice') {
      return (
        <ChoiceButtons
          options={currentNode.options}
          selectedId={null}
          onSelect={(id, value, nextNode) => selectOption(id, value, nextNode, currentNode.setsVariable)}
        />
      );
    }

    if (currentNode.type === 'multi_input') {
      return (
        <MultiInputForm
          inputs={currentNode.inputs}
          onSubmit={(values) => submitMultiInput(values, currentNode.nextNode)}
        />
      );
    }

    if (currentNode.type === 'input') {
      return (
        <div className="space-y-4" onKeyDown={handleKeyDown}>
          {currentNode.inputType === 'text' && (
            <TextInput
              value={inputValue as string}
              onChange={setInputValue}
              placeholder={currentNode.placeholder}
              helperText={currentNode.helperText}
              required={currentNode.validation?.required}
            />
          )}

          {currentNode.inputType === 'number' && (
            <NumberInput
              value={inputValue}
              onChange={setInputValue}
              placeholder={currentNode.placeholder}
              helperText={currentNode.helperText}
              min={currentNode.validation?.min}
              max={currentNode.validation?.max}
              required={currentNode.validation?.required}
            />
          )}

          {currentNode.inputType === 'textarea' && (
            <TextArea
              value={inputValue as string}
              onChange={setInputValue}
              placeholder={currentNode.placeholder}
              helperText={currentNode.helperText}
              required={currentNode.validation?.required}
            />
          )}

          <ContinueButton
            onClick={handleContinue}
            disabled={!isValid()}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ProgressTracker
        currentStep={progress}
        totalSteps={estimatedTotal}
        chapterTitle={currentChapterTitle}
        estimatedMinutes={currentChapterMinutes}
      />

      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto bg-white shadow-xl md:my-4 md:rounded-2xl overflow-hidden">
        <ChatContainer
          messages={state.messageHistory}
          isTyping={state.isTyping}
        />

        <div className="p-4 md:p-6 bg-white border-t border-gray-100 sticky bottom-0">
          {renderInputArea()}
        </div>
      </div>
    </div>
  );
}

export default App;
