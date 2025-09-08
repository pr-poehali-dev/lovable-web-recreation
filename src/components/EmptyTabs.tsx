import React from 'react';
import Icon from '@/components/ui/icon';

interface EmptyTabProps {
  icon: string;
  title: string;
  description: string;
}

export function EmptyTab({ icon, title, description }: EmptyTabProps) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <Icon name={icon} className="h-16 w-16 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
}