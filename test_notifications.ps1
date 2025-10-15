# Test Notification System
# Run this script to test if notifications are working

$baseUrl = "http://localhost:8000"

Write-Host ""
Write-Host "🔔 Testing Notification System" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Create Order Notification (for Seller)
Write-Host "Test 1: Creating order notification for seller..." -ForegroundColor Yellow
$orderNotif = @{
    recipient_uid = "seller_456"
    recipient_type = "seller"
    type = "new_order"
    message = "New order received from Test Buyer for Fresh Bangus!"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/notifications/" -Method POST -ContentType "application/json" -Body $orderNotif
    Write-Host "✅ Order notification created!" -ForegroundColor Green
    Write-Host "   UID: $($response.uid)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: Create Order Approved Notification (for Buyer)
Write-Host "Test 2: Creating order approved notification for buyer..." -ForegroundColor Yellow
$approvedNotif = @{
    recipient_uid = "buyer_123"
    recipient_type = "buyer"
    type = "order_approved"
    message = "Your order for Fresh Tilapia has been approved!"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/notifications/" -Method POST -ContentType "application/json" -Body $approvedNotif
    Write-Host "✅ Order approved notification created!" -ForegroundColor Green
    Write-Host "   UID: $($response.uid)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: Create Order Delivered Notification (for Buyer)
Write-Host "Test 3: Creating order delivered notification for buyer..." -ForegroundColor Yellow
$deliveredNotif = @{
    recipient_uid = "buyer_123"
    recipient_type = "buyer"
    type = "order_delivered"
    message = "Your order for Fresh Bangus has been delivered!"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/notifications/" -Method POST -ContentType "application/json" -Body $deliveredNotif
    Write-Host "✅ Order delivered notification created!" -ForegroundColor Green
    Write-Host "   UID: $($response.uid)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 4: Create Review Notification (for Seller)
Write-Host "Test 4: Creating review notification for seller..." -ForegroundColor Yellow
$reviewNotif = @{
    recipient_uid = "seller_456"
    recipient_type = "seller"
    type = "new_review"
    message = "Juan Dela Cruz left a 5-star review!"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/notifications/" -Method POST -ContentType "application/json" -Body $reviewNotif
    Write-Host "✅ Review notification created!" -ForegroundColor Green
    Write-Host "   UID: $($response.uid)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 5: Create Message Notification (for Seller)
Write-Host "Test 5: Creating message notification for seller..." -ForegroundColor Yellow
$messageNotif = @{
    recipient_uid = "seller_456"
    recipient_type = "seller"
    type = "new_message"
    message = "New message from buyer: Is the fish still fresh?"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/notifications/" -Method POST -ContentType "application/json" -Body $messageNotif
    Write-Host "✅ Message notification created!" -ForegroundColor Green
    Write-Host "   UID: $($response.uid)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check Seller Notifications
Write-Host "📊 Checking seller notifications..." -ForegroundColor Yellow
try {
    $sellerNotifs = Invoke-RestMethod -Uri "$baseUrl/notifications/seller/seller_456" -Method GET
    Write-Host "✅ Found $($sellerNotifs.Count) notification(s) for seller!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Seller Notifications:" -ForegroundColor Cyan
    foreach ($notif in $sellerNotifs | Select-Object -First 5) {
        $icon = switch ($notif.type) {
            "new_order" { "🛒" }
            "new_review" { "⭐" }
            "new_message" { "💬" }
            default { "🔔" }
        }
        Write-Host "   $icon [$($notif.type)] $($notif.message)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Failed to get seller notifications: $_" -ForegroundColor Red
}

Write-Host ""

# Check Buyer Notifications
Write-Host "📊 Checking buyer notifications..." -ForegroundColor Yellow
try {
    $buyerNotifs = Invoke-RestMethod -Uri "$baseUrl/notifications/buyer/buyer_123" -Method GET
    Write-Host "✅ Found $($buyerNotifs.Count) notification(s) for buyer!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Buyer Notifications:" -ForegroundColor Cyan
    foreach ($notif in $buyerNotifs | Select-Object -First 5) {
        $icon = switch ($notif.type) {
            "order_approved" { "✅" }
            "order_delivered" { "🚚" }
            "order_cancelled" { "❌" }
            "new_message" { "💬" }
            default { "🔔" }
        }
        Write-Host "   $icon [$($notif.type)] $($notif.message)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Failed to get buyer notifications: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Green
Write-Host "1. Login to your app as seller (UID: seller_456)" -ForegroundColor White
Write-Host "2. Look at the bell icon 🔔 in the navbar" -ForegroundColor White
Write-Host "3. You should see a red badge with the notification count!" -ForegroundColor White
Write-Host "4. Click the bell to see all notifications" -ForegroundColor White
Write-Host ""
Write-Host "5. Login as buyer (UID: buyer_123)" -ForegroundColor White
Write-Host "6. Check the bell icon for buyer notifications" -ForegroundColor White
Write-Host ""
Write-Host "⏰ Note: Frontend polls every 30 seconds, so wait a bit or refresh!" -ForegroundColor Yellow
Write-Host ""
