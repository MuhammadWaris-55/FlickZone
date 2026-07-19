import { timeAgo } from "@/utils/timeAgo";

export default function CommentItem({ comment }) {
  return (
    <div className="flex gap-3 py-3">
      <img
        src={comment.owner?.avatar}
        alt={comment.owner?.username}
        className="w-9 h-9 rounded-full object-cover shrink-0"
      />
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{comment.owner?.username}</span>
          <span className="text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-sm mt-1">{comment.content}</p>
      </div>
    </div>
  );
}