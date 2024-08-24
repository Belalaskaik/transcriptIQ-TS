"use client";
import React, { useEffect, useState } from "react";
import { View, Text, useTheme } from '@aws-amplify/ui-react';

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}

export const TextGenerateEffect: React.FC<TextGenerateEffectProps> = ({
  words,
  className,
  filter = true,
  duration = 500,
}) => {
  const { tokens } = useTheme();
  const wordsArray = words.split(" ");
  const [visibleWords, setVisibleWords] = useState<number>(0);

  useEffect(() => {
    const intervalDuration = duration / wordsArray.length;
    const interval = setInterval(() => {
      setVisibleWords((prev) => {
        if (prev < wordsArray.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [wordsArray.length, duration]);

  return (
    <View className={className}>
      <View marginTop={tokens.space.medium}>
        <Text
          fontSize={tokens.fontSizes.xl}
          lineHeight={tokens.lineHeights.medium}
          letterSpacing={tokens.letterSpacings.wide}
          color={tokens.colors.font.primary}
          fontWeight={tokens.fontWeights.bold}
        >
          {wordsArray.map((word, idx) => (
            <Text
              key={word + idx}
              as="span"
              opacity={idx < visibleWords ? 1 : 0}
              filter={filter && idx >= visibleWords ? "blur(4px)" : "none"}
              transition={`all ${duration / 1000}s ease-in-out`}
            >
              {word}{" "}
            </Text>
          ))}
        </Text>
      </View>
    </View>
  );
};