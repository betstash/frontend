export const ABI = {"address":"0x78fc7c459af778b2ba1b71e02f59eacbcd209974e96b2f0de60ec8bb946b59bc","name":"Bets","friends":[],"exposed_functions":[{"name":"initialize","visibility":"public","is_entry":true,"is_view":false,"generic_type_params":[],"params":["&signer"],"return":[]},{"name":"transfer","visibility":"public","is_entry":false,"is_view":false,"generic_type_params":[],"params":["&signer","address","u64"],"return":[]},{"name":"deposit","visibility":"public","is_entry":true,"is_view":false,"generic_type_params":[],"params":["&signer","u64"],"return":[]},{"name":"withdraw","visibility":"public","is_entry":true,"is_view":false,"generic_type_params":[],"params":["&signer","u64"],"return":[]},{"name":"balance_of","visibility":"public","is_entry":false,"is_view":true,"generic_type_params":[],"params":["address"],"return":["u64"]}],"structs":[{"name":"AptBalance","is_native":false,"is_event":false,"abilities":["key"],"generic_type_params":[],"fields":[{"name":"balance","type":"u64"}]}]} as const
