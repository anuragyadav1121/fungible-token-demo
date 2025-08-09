# fungible-token-demo
This is the foundation of token system.
🔹 What we can track: 
The total number of tokens in existence (called total supply).   
A list of all users and how many tokens each of them owns. (kind of a explorer)   
A way to identify each user by using unique ids.   
The creator/admin’s ID, to know who is allowed to mint new tokens.

Step 3: Build Core Token Features
These are the main things your token system should be able to do.

🔸 A. Check Balance
Users should be able to view their own token balance.


They can also view other users' balances if needed.


🎯 In the UI:
Add a section that shows the logged-in user’s balance.


Optionally allow users to enter another user’s ID to view their balance.



🔸 B. View Total Supply
Everyone should be able to see how many tokens exist in total.


🎯 In the UI:
Display the total supply (e.g., “Total Supply: 1,000,000”).


🔸 C. Transfer Tokens
Users can send tokens to others by entering:


The receiver’s ID


The number of tokens to send


Make sure the sender has enough tokens before sending.


🎯 In the UI:
Create a simple form with:


Input for receiver’s ID


Input for amount to send


“Send” button


Show a message like:


✅ “Transfer successful!”


❌ “Not enough tokens!”



🔸 D. Mint Tokens (Only by Creator)
This allows the creator (admin) to generate new tokens and give them to any user.
🔹 What to do:
Only allow the creator to mint tokens.


When minting, update:


The total supply


The receiver’s balance


🎯 In the UI:
Visible only to the creator:


Input for recipient’s ID


Input for amount to mint


“Mint Tokens” button


Show a confirmation message:


✅ “Minted 500 tokens to User X”


❌ “Only the creator can mint tokens”

