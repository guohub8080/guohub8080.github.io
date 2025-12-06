import React from 'react';
import PlanTodoIcon from './PlanTodoIcon.tsx';

export const planTodoConfig = {
  title: '任务清单',
  slug: 'todo',
  icon: <PlanTodoIcon className="w-full h-full" />,
  description: '任务管理与计划清单'
};

export default planTodoConfig;
export { PlanTodoIcon };

