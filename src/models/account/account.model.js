import mongoose from "mongoose";
import { accountSchema } from "./account.schema.js";

accountSchema.statics.findSomethingNew = function () {
  console.log({ findSomethingNewThisFunc: this });
};

accountSchema.methods.instanceMethod = function () {
  console.log({ InstanceMethodsThis: this });
};

const Account = mongoose.model("Account", accountSchema);

export { Account };
