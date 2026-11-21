import React from 'react';
import { Shield, Gamepad2, Coins, User } from 'lucide-react';

const RoleBadge = ({ role, size = 'sm', showIcon = true }) => {
  const configs = {
    executive: {
      label: 'Executive Officer',
      icon: Shield,
      classes: 'bg-purple-50 text-purple-700 border-purple-200',
      iconColor: 'text-purple-600',
    },
    game_manager: {
      label: 'Game Manager',
      icon: Gamepad2,
      classes: 'bg-blue-50 text-blue-700 border-blue-200',
      iconColor: 'text-blue-600',
    },
    finance_officer: {
      label: 'Finance Officer',
      icon: Coins,
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconColor: 'text-emerald-600',
    },
    member: {
      label: 'Academy Member',
      icon: User,
      classes: 'bg-slate-100 text-slate-700 border-slate-200',
      iconColor: 'text-slate-500',
    },
  };

  const config = configs[role] || configs.member;
  const Icon = config.icon;

  const sizeClasses = {
    xs: 'text-xs px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2.5 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-display uppercase tracking-wider font-semibold rounded-md border shadow-xs ${config.classes} ${sizeClasses}`}
    >
      {showIcon && <Icon className={`w-3.5 h-3.5 shrink-0 ${config.iconColor}`} />}
      <span>{config.label}</span>
    </span>
  );
};

export default RoleBadge;
