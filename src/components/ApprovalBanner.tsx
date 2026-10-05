'use client';

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, UserCheck } from 'lucide-react';

interface ApprovalBannerProps {
  actionTitle?: string;
  actionDescription?: string;
  onApprove?: () => void;
  onReject?: () => void;
}

export const ApprovalBanner: React.FC<ApprovalBannerProps> = ({
  actionTitle = 'Apply Builder Agent Code Changes to Repository',
  actionDescription = 'Agent proposed modifying 3 files: QueueDisplay.tsx, StaffPanel.tsx, and CheckInModal.tsx.',
  onApprove,
  onReject,
}) => {
  const [approvedState, setApprovedState] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const handleApprove = () => {
    setApprovedState('approved');
    onApprove?.();
  };

  const handleReject = () => {
    setApprovedState('rejected');
    onReject?.();
  };

  if (approvedState === 'approved') {
    return (
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs flex items-center justify-between text-emerald-300">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Action approved by user. Changes registered to project workflow.</span>
        </div>
        <button
          onClick={() => setApprovedState('pending')}
          className="text-[11px] underline text-emerald-400 hover:text-emerald-200"
        >
          Reset
        </button>
      </div>
    );
  }

  if (approvedState === 'rejected') {
    return (
      <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs flex items-center justify-between text-rose-300">
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Action rejected by user. External agent instructions were not executed.</span>
        </div>
        <button
          onClick={() => setApprovedState('pending')}
          className="text-[11px] underline text-rose-400 hover:text-rose-200"
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <div className="p-3.5 bg-violet-950/30 border border-violet-500/30 rounded-xl space-y-2">
      <div className="flex items-start gap-2.5">
        <div className="p-1 rounded-md bg-violet-500/20 text-violet-300 mt-0.5 shrink-0">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-violet-200 uppercase tracking-wide">
              User Approval Required
            </span>
            <span className="text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.2 rounded border border-violet-500/30">
              Zero-Auto Execution Rule
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-200 mt-0.5">{actionTitle}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{actionDescription}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1 border-t border-violet-500/20">
        <button
          onClick={handleReject}
          className="px-3 py-1 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
        >
          Decline Action
        </button>
        <button
          onClick={handleApprove}
          className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <UserCheck className="w-3.5 h-3.5" /> Approve Action
        </button>
      </div>
    </div>
  );
};
