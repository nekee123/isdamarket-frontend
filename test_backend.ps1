# FastAPI Backend Test Script
# Run this in PowerShell to test all your backend endpoints

$baseUrl = "https://isdamarket-3.onrender.com"

Write-Host ""
Write-Host "🧪 Testing IsdaMarket Backend API" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Base URL: $baseUrl" -ForegroundColor Gray
Write-Host ""

# Test 1: Submit Review
Write-Host "Test 1: Submitting a review..." -ForegroundColor Yellow
$reviewBody = @{
    buyer_uid = "test_buyer_001"
    buyer_name = "John Doe"
    seller_uid = "test_seller_001"
    order_uid = "test_order_001"
    rating = 5
    comment = "Excellent fresh fish! Highly recommended."
} | ConvertTo-Json

try {
    $reviewResponse = Invoke-RestMethod -Uri "$baseUrl/reviews/" -Method POST -ContentType "application/json" -Body $reviewBody
    Write-Host "✅ SUCCESS: Review created!" -ForegroundColor Green
    Write-Host "   Review UID: $($reviewResponse.uid)" -ForegroundColor Cyan
    Write-Host "   Rating: $($reviewResponse.rating) stars" -ForegroundColor Cyan
    $reviewUid = $reviewResponse.uid
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Get Seller Reviews
Write-Host "Test 2: Getting seller reviews..." -ForegroundColor Yellow
try {
    $reviews = Invoke-RestMethod -Uri "$baseUrl/reviews/seller/test_seller_001" -Method GET
    Write-Host "✅ SUCCESS: Found $($reviews.Count) review(s)" -ForegroundColor Green
    if ($reviews.Count -gt 0) {
        Write-Host "   Latest review: $($reviews[0].comment)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Send Message
Write-Host "Test 3: Sending a message..." -ForegroundColor Yellow
$messageBody = @{
    sender_uid = "test_buyer_001"
    sender_type = "buyer"
    recipient_uid = "test_seller_001"
    recipient_type = "seller"
    message = "Hi! Is the fish still fresh today?"
} | ConvertTo-Json

try {
    $messageResponse = Invoke-RestMethod -Uri "$baseUrl/messages/" -Method POST -ContentType "application/json" -Body $messageBody
    Write-Host "✅ SUCCESS: Message sent!" -ForegroundColor Green
    Write-Host "   Message UID: $($messageResponse.uid)" -ForegroundColor Cyan
    Write-Host "   Content: $($messageResponse.message)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Get Messages
Write-Host "Test 4: Getting messages between users..." -ForegroundColor Yellow
try {
    $messages = Invoke-RestMethod -Uri "$baseUrl/messages/test_buyer_001/test_seller_001" -Method GET
    Write-Host "✅ SUCCESS: Found $($messages.Count) message(s)" -ForegroundColor Green
    if ($messages.Count -gt 0) {
        Write-Host "   Latest: $($messages[-1].message)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 5: Get Conversations
Write-Host "Test 5: Getting conversation list..." -ForegroundColor Yellow
try {
    $conversations = Invoke-RestMethod -Uri "$baseUrl/messages/conversations/test_buyer_001" -Method GET
    Write-Host "✅ SUCCESS: Found $($conversations.Count) conversation(s)" -ForegroundColor Green
    foreach ($conv in $conversations) {
        Write-Host "   → $($conv.other_user_name): $($conv.last_message)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 6: Get Buyer Notifications
Write-Host "Test 6: Getting buyer notifications..." -ForegroundColor Yellow
try {
    $buyerNotifs = Invoke-RestMethod -Uri "$baseUrl/notifications/buyer/test_buyer_001" -Method GET
    Write-Host "✅ SUCCESS: Found $($buyerNotifs.Count) notification(s)" -ForegroundColor Green
    foreach ($notif in $buyerNotifs | Select-Object -First 3) {
        Write-Host "   → $($notif.message)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 7: Get Seller Notifications
Write-Host "Test 7: Getting seller notifications..." -ForegroundColor Yellow
try {
    $sellerNotifs = Invoke-RestMethod -Uri "$baseUrl/notifications/seller/test_seller_001" -Method GET
    Write-Host "✅ SUCCESS: Found $($sellerNotifs.Count) notification(s)" -ForegroundColor Green
    foreach ($notif in $sellerNotifs | Select-Object -First 3) {
        Write-Host "   → [$($notif.type)] $($notif.message)" -ForegroundColor Cyan
    }
    
    # Save first notification UID for next test
    if ($sellerNotifs.Count -gt 0) {
        $notifUid = $sellerNotifs[0].uid
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 8: Create Notification
Write-Host "Test 8: Creating a notification..." -ForegroundColor Yellow
$notifBody = @{
    recipient_uid = "test_buyer_001"
    recipient_type = "buyer"
    type = "order_approved"
    message = "Your order has been approved by the seller!"
} | ConvertTo-Json

try {
    $notifResponse = Invoke-RestMethod -Uri "$baseUrl/notifications/" -Method POST -ContentType "application/json" -Body $notifBody
    Write-Host "✅ SUCCESS: Notification created!" -ForegroundColor Green
    Write-Host "   Notification UID: $($notifResponse.uid)" -ForegroundColor Cyan
    Write-Host "   Message: $($notifResponse.message)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 9: Mark Notification as Read (if we have one)
if ($notifUid) {
    Write-Host "Test 9: Marking notification as read..." -ForegroundColor Yellow
    try {
        $readResponse = Invoke-RestMethod -Uri "$baseUrl/notifications/$notifUid/read" -Method PATCH
        Write-Host "✅ SUCCESS: Notification marked as read!" -ForegroundColor Green
    } catch {
        Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Test 9: Skipped (no notification UID available)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "🎉 Testing Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open Neo4j Aura Browser" -ForegroundColor White
Write-Host "2. Run: MATCH (n) RETURN labels(n), count(n)" -ForegroundColor White
Write-Host "3. You should see Review, Message, and Notification nodes!" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Verify Data:" -ForegroundColor Cyan
Write-Host "   MATCH (r:Review {buyer_uid: 'test_buyer_001'}) RETURN r" -ForegroundColor Gray
Write-Host "   MATCH (m:Message {sender_uid: 'test_buyer_001'}) RETURN m" -ForegroundColor Gray
Write-Host "   MATCH (n:Notification {recipient_uid: 'test_seller_001'}) RETURN n" -ForegroundColor Gray
Write-Host ""
