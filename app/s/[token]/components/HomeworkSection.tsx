"use client";

import { useMemo, useState } from "react";
import { HomeworkCard } from "./HomeworkCard";
import { HomeworkProgressCard } from "./HomeworkProgressCard";

type HomeworkItem = {
  id: string;
  title: string;
  description: string | null;
  link_url: string | null;
  dog_note: string | null;
  steps: string[] | null;
  is_checked: boolean;
};

type HomeworkSectionProps = {
  sessionToken: string;
  items: HomeworkItem[];
};

/**
 * Homework section
 */
export const HomeworkSection = ({ sessionToken, items }: HomeworkSectionProps) => {
  const [homeworkItems, setHomeworkItems] = useState(items);

  const completedCount = homeworkItems.filter((item) => item.is_checked).length;
  const totalCount = homeworkItems.length;

  const orderedItems = useMemo(() => {
    const incompleteItems = homeworkItems.filter((item) => !item.is_checked);
    const completedItems = homeworkItems.filter((item) => item.is_checked);

    return [...incompleteItems, ...completedItems];
  }, [homeworkItems]);

  const handleCheckedChange = (homeworkId: string, isChecked: boolean) => {
    setHomeworkItems((currentItems) =>
      currentItems.map((item) =>
        item.id === homeworkId
          ? {
              ...item,
              is_checked: isChecked,
            }
          : item
      )
    );
  };

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-foreground text-xl font-bold">
          Your Homework <span aria-hidden="true">📋</span>
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">Practice these before your next lesson</p>
      </div>

      <HomeworkProgressCard completedCount={completedCount} totalCount={totalCount} />

      <div>
        {orderedItems.map((item) => (
          <HomeworkCard
            key={item.id}
            id={item.id}
            sessionToken={sessionToken}
            title={item.title}
            description={item.description}
            link_url={item.link_url}
            dog_note={item.dog_note}
            steps={item.steps}
            initialChecked={item.is_checked}
            onCheckedChange={handleCheckedChange}
          />
        ))}
      </div>
    </section>
  );
};
