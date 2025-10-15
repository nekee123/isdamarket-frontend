# Backend Requirements for Message Notifications

## Issue
When someone sends a message, the notification needs to show the **sender's actual name** (e.g., "Juan Cruz") instead of generic text like "New message from buyer".

## Current Frontend Implementation

The frontend now **pulls message notifications from both sources**:
1. `/messages/conversations/{userId}` - Existing conversations
2. `/notifications/` - Message notifications (temporarily, until backend is updated)

The frontend **merges** these and displays them in the Messages dropdown (💬).

## Required Backend Changes

### 1. Include Sender Information in Message Notifications

**Current Behavior (NEEDS IMPROVEMENT):**
```json
{
  "type": "new_message",
  "message": "New message from buyer"  // ❌ Generic text
}
```

**Required Behavior (CORRECT):**
```json
{
  "type": "new_message",
  "message": "New message from Juan Cruz",  // ✅ Actual sender name
  "sender_uid": "buyer_uid_123",
  "sender_name": "Juan Cruz"  // ✅ Add this field
}
```

### 2. Ensure Conversations Endpoint Returns Correct Data

**Endpoint:** `GET /messages/conversations/{userId}`

**Required Response Format:**
```json
[
  {
    "other_user_uid": "seller_or_buyer_uid",
    "other_user_name": "John Doe",  // ← IMPORTANT: Must be sender's actual name
    "last_message": "Hello, is this still available?",
    "last_message_time": "2025-10-15T17:30:00Z",
    "unread_count": 3  // Number of unread messages from this person
  }
]
```

**Key Requirements:**
- ✅ `other_user_name` must be the **actual sender's name** (e.g., "John Doe", "Maria Santos")
- ❌ NOT generic text like "New message from buyer" or "New message from seller"
- ✅ `last_message` should be the actual message content
- ✅ `unread_count` should track unread messages per conversation
- ✅ Sort conversations by `last_message_time` (most recent first)

### 3. Message Notification Logic

**When a message is sent:**

1. ✅ **DO:** Create a notification with sender information
   ```json
   {
     "type": "new_message",
     "message": "New message from [SENDER_NAME]",  // Use actual name
     "sender_uid": "sender_user_id",
     "sender_name": "Juan Cruz",  // ← IMPORTANT: Add sender's name
     "created_at": "2025-10-15T17:30:00Z"
   }
   ```

2. ✅ **DO:** Update the conversations endpoint data
   - Add/update conversation entry
   - Increment `unread_count` for recipient
   - Update `last_message` and `last_message_time`

**Important:** The notification message should include the sender's **actual name**, not generic text like "buyer" or "seller".

### 4. Marking Messages as Read

**Endpoint:** Should exist or be created

```
PATCH /messages/conversations/{userId}/{otherUserId}/read
```

**Purpose:** Mark all messages in a conversation as read

**Effect:**
- Set `unread_count` to 0 for that conversation
- Update message read status in database

## Frontend Implementation (Already Done)

✅ Frontend pulls message notifications from `/notifications/` endpoint
✅ Frontend merges notifications with conversations from `/messages/conversations/`
✅ Frontend extracts sender name from notification message text
✅ Frontend displays all messages in Messages dropdown (💬)
✅ Frontend filters message notifications out of Notifications dropdown (🔔)
✅ Frontend shows unread message badges
✅ Frontend navigates to Messages page when clicking conversations

## Testing Checklist

After backend changes:

- [ ] Send a message from Buyer to Seller
- [ ] Seller should see message in Messages dropdown (💬), NOT Notifications (🔔)
- [ ] Message should show buyer's actual name (e.g., "Juan Cruz")
- [ ] Unread count badge should appear on Messages icon
- [ ] Clicking conversation should open chat with correct person
- [ ] After reading, unread count should decrease
- [ ] No "New message from buyer" text anywhere

## Example Flow

**Scenario:** Juan (buyer) messages Maria (seller) about a fish product

1. Juan sends: "Is the bangus still fresh?"
2. Backend updates conversations for Maria:
   ```json
   {
     "other_user_uid": "juan_uid_123",
     "other_user_name": "Juan Cruz",  // ← Actual name!
     "last_message": "Is the bangus still fresh?",
     "last_message_time": "2025-10-15T17:45:00Z",
     "unread_count": 1
   }
   ```
3. Maria sees in Messages dropdown:
   - **Juan Cruz** (not "New message from buyer")
   - "Is the bangus still fresh?"
   - Unread badge: 1
4. Maria clicks → Opens chat with Juan
5. Backend marks as read → unread_count becomes 0

## Summary

**Key Change:** Messages are NOT notifications. They should only appear in the Messages/Conversations system, never in the general Notifications system.

**Display Rule:** Always show the sender's actual name (e.g., "Juan Cruz", "Maria Santos"), never generic text like "New message from buyer".
