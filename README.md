# Expense Tracker (Expo SDK 57)

Offline expense tracker built with React Native, Expo Router and AsyncStorage. No backend, no APIs.

## Run on your Android phone
1. Install Node.js 20+ on your computer and the **Expo Go** app on your phone.
2. Unzip this folder, open a terminal inside it and run:
   ```bash
   npm install --legacy-peer-deps
   npx expo start
   ```
3. Scan the QR code with Expo Go. Phone and computer must be on the same Wi-Fi
   (or run `npx expo start --tunnel`).

## Structure
- `app/` – screens (Expo Router, side drawer and bottom tabs)
- `components/` – SummaryCard, TransactionItem, CategoryCard, TransactionForm
- `context/ExpenseContext.tsx` – app state
- `utils/storage.ts` – AsyncStorage helpers
- `types/expense.ts` – types, categories, currencies

## Drawer navigation
- Tap the menu icon in the top-left corner of any bottom-tab screen, or swipe from the left edge.
- Choose Dashboard, Transactions, Add transaction, Categories or Settings.
- Tap outside the drawer or press Android Back to close it. Bottom tabs remain available.
- The app root includes the gesture-handler wrapper required for native drawer gestures.

TypeScript, Expo dependency compatibility and Android bundle checks are run before delivery.
Physical Android/Expo Go interaction testing is still required.


## Starting the app
1. Unzip into a new folder (no old node_modules).
2. `npm install`
3. `npx expo start -c`

The side menu uses plain React Native only, so it works in Expo Go.

## Accounts
On first open you see Sign in. Tap "Create account" to sign up with name, email and password. Accounts are saved only on this phone (no internet needed). Sign out from Settings or the side menu.
