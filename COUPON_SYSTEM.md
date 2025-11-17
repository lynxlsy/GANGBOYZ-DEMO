# Coupon Management System

## Overview
The coupon management system allows administrators to create, edit, and delete discount coupons directly from the homepage in edit mode. Customers can apply these coupons during checkout to receive discounts on their purchases.

## Features
- Create custom coupon codes with personalized names
- Set discount as either percentage or fixed amount
- Activate/deactivate coupons as needed
- View available coupons during checkout
- Apply coupons to reduce order total

## How to Use

### For Administrators (Edit Mode)
1. Enable edit mode by pressing `Ctrl+E` or `Cmd+E` or using the edit mode toggle
2. Scroll to the bottom of the homepage to find the "Gerenciamento de Cupons" section
3. Use the form to create new coupons:
   - Enter a unique coupon code (e.g., "DESC10", "PROMO20")
   - Provide a descriptive name (e.g., "Desconto de 10%", "Promoção Especial")
   - Select discount type: Percentage (%) or Fixed Value (R$)
   - Enter the discount value
4. Click "Criar Cupom" to save
5. Edit or delete existing coupons using the action buttons
6. Toggle coupons between active/inactive status as needed

### For Customers (Checkout)
1. During checkout, enter a coupon code in the "Código de Desconto" field
2. Click "Aplicar" to apply the discount
3. View available active coupons below the input field for reference
4. The discount will be automatically calculated and displayed in the order summary

## Technical Implementation

### Data Storage
Coupons are stored in localStorage with the key `gang-boyz-coupons` as a JSON array.

### Coupon Structure
```json
{
  "id": "unique-id",
  "code": "DESC10",
  "name": "Desconto de 10%",
  "discountType": "percentage" | "fixed",
  "discountValue": 10,
  "isActive": true
}
```

### Discount Calculation
- **Percentage Discount**: Subtotal × (discountValue / 100)
- **Fixed Discount**: Fixed amount off the subtotal
- Discount is capped at the subtotal amount to prevent negative totals

## Validation Rules
- Coupon codes must be unique
- Discount values must be greater than zero
- Percentage discounts cannot exceed 100%
- Only active coupons can be applied during checkout

## Integration Points
- Homepage edit mode displays the coupon management interface
- Checkout page reads active coupons and applies discounts
- localStorage-utils for safe data persistence