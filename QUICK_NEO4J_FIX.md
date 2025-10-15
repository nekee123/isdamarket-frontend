# Quick Neo4j Fix Guide

## 🎯 The Problem

Your FastAPI has endpoints but they're **NOT saving to Neo4j**. They're probably returning mock data.

---

## ✅ Quick Check

### Run this in Neo4j Aura Browser:

```cypher
// Check what nodes exist
MATCH (n) RETURN labels(n) as NodeType, count(n) as Count

// Check for reviews
MATCH (r:Review) RETURN count(r)

// Check for messages  
MATCH (m:Message) RETURN count(m)

// Check for notifications
MATCH (n:Notification) RETURN count(n)
```

**If all return 0 or don't exist** → Your backend isn't writing to the database!

---

## 🔧 The Fix

Your FastAPI endpoints need to **CREATE nodes in Neo4j**, not just return JSON.

### Example: What's Wrong vs What's Right

**❌ WRONG (Current - No Database Write):**
```python
@app.post("/reviews/")
async def create_review(review: ReviewCreate):
    # Just returns data - DOESN'T SAVE TO NEO4J!
    return {
        "uid": "review_123",
        "rating": review.rating,
        "comment": review.comment
    }
```

**✅ RIGHT (Fixed - Saves to Neo4j):**
```python
from neo4j import GraphDatabase
import uuid

@app.post("/reviews/")
async def create_review(review: ReviewCreate):
    review_uid = f"review_{uuid.uuid4().hex[:12]}"
    
    # SAVE TO NEO4J
    with driver.session() as session:
        session.run("""
            CREATE (r:Review {
                uid: $uid,
                buyer_uid: $buyer_uid,
                buyer_name: $buyer_name,
                seller_uid: $seller_uid,
                order_uid: $order_uid,
                rating: $rating,
                comment: $comment,
                created_at: datetime()
            })
        """, 
            uid=review_uid,
            buyer_uid=review.buyer_uid,
            buyer_name=review.buyer_name,
            seller_uid=review.seller_uid,
            order_uid=review.order_uid,
            rating=review.rating,
            comment=review.comment
        )
    
    return {"uid": review_uid, "message": "Review created"}
```

---

## 📝 Copy-Paste Solutions

### 1. Initialize Neo4j Driver (Add to your main.py)

```python
from neo4j import GraphDatabase
import os

# Initialize Neo4j driver
driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI"),  # e.g., "neo4j+s://xxxxx.databases.neo4j.io"
    auth=(os.getenv("NEO4J_USER"), os.getenv("NEO4J_PASSWORD"))
)

# Close driver on shutdown
@app.on_event("shutdown")
async def shutdown():
    driver.close()
```

### 2. Reviews Endpoint (Replace your current one)

```python
import uuid
from datetime import datetime

@app.post("/reviews/")
async def create_review(review: ReviewCreate):
    review_uid = f"review_{uuid.uuid4().hex[:12]}"
    
    with driver.session() as session:
        session.run("""
            CREATE (r:Review {
                uid: $uid,
                buyer_uid: $buyer_uid,
                buyer_name: $buyer_name,
                seller_uid: $seller_uid,
                order_uid: $order_uid,
                rating: $rating,
                comment: $comment,
                created_at: datetime()
            })
        """, **{
            "uid": review_uid,
            "buyer_uid": review.buyer_uid,
            "buyer_name": review.buyer_name,
            "seller_uid": review.seller_uid,
            "order_uid": review.order_uid,
            "rating": review.rating,
            "comment": review.comment or ""
        })
    
    return {
        "uid": review_uid,
        "buyer_uid": review.buyer_uid,
        "buyer_name": review.buyer_name,
        "seller_uid": review.seller_uid,
        "order_uid": review.order_uid,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": datetime.now().isoformat()
    }

@app.get("/reviews/seller/{seller_uid}")
async def get_seller_reviews(seller_uid: str):
    with driver.session() as session:
        result = session.run("""
            MATCH (r:Review {seller_uid: $seller_uid})
            RETURN r.uid as uid,
                   r.buyer_uid as buyer_uid,
                   r.buyer_name as buyer_name,
                   r.seller_uid as seller_uid,
                   r.order_uid as order_uid,
                   r.rating as rating,
                   r.comment as comment,
                   r.created_at as created_at
            ORDER BY r.created_at DESC
        """, seller_uid=seller_uid)
        
        reviews = []
        for record in result:
            reviews.append({
                "uid": record["uid"],
                "buyer_uid": record["buyer_uid"],
                "buyer_name": record["buyer_name"],
                "seller_uid": record["seller_uid"],
                "order_uid": record["order_uid"],
                "rating": record["rating"],
                "comment": record["comment"],
                "created_at": record["created_at"].isoformat() if record["created_at"] else None
            })
        
        return reviews
```

### 3. Messages Endpoint (Replace your current one)

```python
@app.post("/messages/")
async def send_message(message: MessageCreate):
    message_uid = f"msg_{uuid.uuid4().hex[:12]}"
    
    with driver.session() as session:
        session.run("""
            CREATE (m:Message {
                uid: $uid,
                sender_uid: $sender_uid,
                sender_type: $sender_type,
                recipient_uid: $recipient_uid,
                recipient_type: $recipient_type,
                message: $message,
                read: false,
                created_at: datetime()
            })
        """, **{
            "uid": message_uid,
            "sender_uid": message.sender_uid,
            "sender_type": message.sender_type,
            "recipient_uid": message.recipient_uid,
            "recipient_type": message.recipient_type,
            "message": message.message
        })
    
    return {
        "uid": message_uid,
        "sender_uid": message.sender_uid,
        "sender_type": message.sender_type,
        "recipient_uid": message.recipient_uid,
        "recipient_type": message.recipient_type,
        "message": message.message,
        "created_at": datetime.now().isoformat()
    }

@app.get("/messages/{user1_uid}/{user2_uid}")
async def get_messages(user1_uid: str, user2_uid: str):
    with driver.session() as session:
        result = session.run("""
            MATCH (m:Message)
            WHERE (m.sender_uid = $user1 AND m.recipient_uid = $user2)
               OR (m.sender_uid = $user2 AND m.recipient_uid = $user1)
            RETURN m.uid as uid,
                   m.sender_uid as sender_uid,
                   m.sender_type as sender_type,
                   m.recipient_uid as recipient_uid,
                   m.recipient_type as recipient_type,
                   m.message as message,
                   m.created_at as created_at
            ORDER BY m.created_at ASC
        """, user1=user1_uid, user2=user2_uid)
        
        messages = []
        for record in result:
            messages.append({
                "uid": record["uid"],
                "sender_uid": record["sender_uid"],
                "sender_type": record["sender_type"],
                "recipient_uid": record["recipient_uid"],
                "recipient_type": record["recipient_type"],
                "message": record["message"],
                "created_at": record["created_at"].isoformat() if record["created_at"] else None
            })
        
        return messages
```

### 4. Notifications Endpoint (Replace your current one)

```python
@app.post("/notifications/")
async def create_notification(notification: NotificationCreate):
    notification_uid = f"notif_{uuid.uuid4().hex[:12]}"
    
    with driver.session() as session:
        session.run("""
            CREATE (n:Notification {
                uid: $uid,
                recipient_uid: $recipient_uid,
                recipient_type: $recipient_type,
                type: $type,
                message: $message,
                read: false,
                created_at: datetime()
            })
        """, **{
            "uid": notification_uid,
            "recipient_uid": notification.recipient_uid,
            "recipient_type": notification.recipient_type,
            "type": notification.type,
            "message": notification.message
        })
    
    return {"uid": notification_uid, "message": "Notification created"}

@app.get("/notifications/buyer/{buyer_uid}")
async def get_buyer_notifications(buyer_uid: str):
    with driver.session() as session:
        result = session.run("""
            MATCH (n:Notification {recipient_uid: $buyer_uid, recipient_type: 'buyer'})
            RETURN n.uid as uid,
                   n.recipient_uid as recipient_uid,
                   n.recipient_type as recipient_type,
                   n.type as type,
                   n.message as message,
                   n.read as read,
                   n.created_at as created_at
            ORDER BY n.created_at DESC
        """, buyer_uid=buyer_uid)
        
        notifications = []
        for record in result:
            notifications.append({
                "uid": record["uid"],
                "recipient_uid": record["recipient_uid"],
                "recipient_type": record["recipient_type"],
                "type": record["type"],
                "message": record["message"],
                "read": record["read"],
                "created_at": record["created_at"].isoformat() if record["created_at"] else None
            })
        
        return notifications

@app.get("/notifications/seller/{seller_uid}")
async def get_seller_notifications(seller_uid: str):
    with driver.session() as session:
        result = session.run("""
            MATCH (n:Notification {recipient_uid: $seller_uid, recipient_type: 'seller'})
            RETURN n.uid as uid,
                   n.recipient_uid as recipient_uid,
                   n.recipient_type as recipient_type,
                   n.type as type,
                   n.message as message,
                   n.read as read,
                   n.created_at as created_at
            ORDER BY n.created_at DESC
        """, seller_uid=seller_uid)
        
        notifications = []
        for record in result:
            notifications.append({
                "uid": record["uid"],
                "recipient_uid": record["recipient_uid"],
                "recipient_type": record["recipient_type"],
                "type": record["type"],
                "message": record["message"],
                "read": record["read"],
                "created_at": record["created_at"].isoformat() if record["created_at"] else None
            })
        
        return notifications

@app.patch("/notifications/{notification_uid}/read")
async def mark_notification_read(notification_uid: str):
    with driver.session() as session:
        session.run("""
            MATCH (n:Notification {uid: $uid})
            SET n.read = true
        """, uid=notification_uid)
    
    return {"success": True}
```

---

## 🧪 Test After Fixing

### 1. Restart your FastAPI server

### 2. Test review creation:
```bash
curl -X POST https://isdamarket-3.onrender.com/reviews/ \
  -H "Content-Type: application/json" \
  -d '{
    "buyer_uid": "test_buyer",
    "buyer_name": "Test User",
    "seller_uid": "test_seller",
    "order_uid": "test_order",
    "rating": 5,
    "comment": "Great!"
  }'
```

### 3. Check Neo4j Aura:
```cypher
MATCH (r:Review) RETURN r LIMIT 5
```

**You should now see the review!** ✅

---

## 🔍 Still Not Working?

### Check your .env file has:
```env
NEO4J_URI=neo4j+s://xxxxx.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=your-password-here
```

### Test Neo4j connection:
```python
# Add this to test connection
@app.get("/test-neo4j")
async def test_neo4j():
    try:
        with driver.session() as session:
            result = session.run("RETURN 'Connected!' as message")
            return {"status": "success", "message": result.single()["message"]}
    except Exception as e:
        return {"status": "error", "message": str(e)}
```

Visit: `https://isdamarket-3.onrender.com/test-neo4j`

Should return: `{"status": "success", "message": "Connected!"}`

---

## 📦 Required Package

Make sure you have:
```bash
pip install neo4j
```

In your `requirements.txt`:
```
neo4j>=5.0.0
```

---

## 🎯 Summary

**Problem:** Endpoints exist but don't save to Neo4j

**Solution:** Add `session.run()` with CREATE statements to each endpoint

**Files to modify:**
1. Your main FastAPI file (add driver initialization)
2. Reviews endpoint (add CREATE statement)
3. Messages endpoint (add CREATE statement)
4. Notifications endpoint (add CREATE statement)

**After fixing:** Data will appear in Neo4j Aura! ✅
