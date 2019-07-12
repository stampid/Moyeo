import crypto from "crypto";

const hash = password => {
  let hashPassWord = 0;
  const shasum = crypto.createHash("sha1");
  shasum.update(password);
  hashPassWord = shasum.digest("hex").slice(0, 50);
  return hashPassWord;
};

export default hash;
