# dendai-idcard-reader

PC/SC 経由で学生証を読み取って IDm / PMm / 学籍番号 を出力します。

## 実行方法

```bash
$ cp .env.example .env
$ yarn install
$ yarn build
$ yarn start
```

## 技術メモ

### カード情報のダンプ

どこにデータがあるかどうかは [felicalib](http://felicalib.tmurakam.org/document.html) を使ったダンプをしてあげるといい感じに見れます。  
先に [NFCポートソフトウェア](https://www.sony.co.jp/Products/felica/consumer/support/download/) が必要です。

### CONTROL_CODE

リーダーに固有のコード？のようです(詳細は不明)  
RC-S380 の場合は `0x003136b0` を指定すると動きます

### 読み取る領域について

学籍番号は以下のブロックから取得しています。

- システムコード: `FE00`
- ブロック: `1A8B:0000`

他にも日付データらしきものが同じ `1A8B` ブロックにありますが、詳細は不明です。

## 参考文献

- [Part 3. Requirements for PC-Connected Interface Devices - Supplemental Document for Contactless ICC's](http://pcscworkgroup.com/Download/Specifications/pcsc3_v2.02.00_sup2.pdf)
- [SONY Felica カード ユーザーズマニュアル 抜粋版](https://www.sony.co.jp/Products/felica/business/tech-support/data/card_usersmanual_2.11j.pdf)
- [SONY Felica 技術方式の各種コードについて](https://www.sony.co.jp/Products/felica/business/tech-support/data/M619_FeliCaTechnologyCodeDescriptions_1.51j.pdf)
- [pokusew/nfc-pcsc: Easy reading and writing NFC tags and cards in Node.js](https://github.com/pokusew/nfc-pcsc)
- [pokusew/node-pcsclite: Bindings over pcsclite to access Smart Cards](https://github.com/pokusew/node-pcsclite)
- [APDU (Application Protocol Data Unit) プロトコル - Smart Card Guy](https://smartcardguy.hatenablog.jp/entry/2018/08/11/153334)
- [PCSCでAndroidとかのスマホをうまく処理する | 何かできる気がする](https://dekirukigasuru.com/blog/2019/02/07/pcsc-control/)
- [PC/SC APIを用いてSuicaカードの利用履歴情報の読み取り | TomoSoft](https://tomosoft.jp/design/?p=5543)
- [WebUSB APIでSuicaの履歴を読み取るメモ - My Note](https://www.kenichi-odo.com/articles/2020_10_11_read-suica-by-webusb)
- [android - How to read multiple block data from Sony Felica NFC card? - Stack Overflow](https://stackoverflow.com/questions/71393998/how-to-read-multiple-block-data-from-sony-felica-nfc-card)
- [[PASMO] FeliCa から情報を吸い出してみる - FeliCaの仕様編 [Android][Kotlin] - Qiita](https://qiita.com/YasuakiNakazawa/items/3109df682af2a7032f8d)
- [javacard - How to send commands to smart card reader (and not to the smart card) while no card present? - Stack Overflow](https://stackoverflow.com/questions/35389657/how-to-send-commands-to-smart-card-reader-and-not-to-the-smart-card-while-no-c)
- [pcsc - How to communicate with the reader using PC/SC - Stack Overflow](https://stackoverflow.com/questions/54951812/how-to-communicate-with-the-reader-using-pc-sc)
- [Smart Card Protocol T0/T1 – Bugcutter](https://bugcutter.com/tutorial/index.php/2019/10/15/smart-card-protocol-t0-t1/)
- [PN532 NFC RFID module のインターフェースを直接叩いて Felica 学生カードを読む - Qiita](https://qiita.com/nanbuwks/items/995e3d63296a69f0f016)
- [FeliCa システムコードの切り替えは Polling コマンドのみで【iOS 13 Core NFC】 - Qiita](https://qiita.com/treastrain/items/04f50a91f70fd6480fc0)
- [LazyPCSCFelicaLite (C++でPC/SCを使ってFelica Liteにアクセスするライブラリ) - Qiita](https://qiita.com/gpsnmeajp/items/a378e1829fba1c3a3ed7)
- [NfcF#transceiveのdataにはlengthも入れるべし | Atelier NODOKA](http://www.atelier-nodoka.net/2012/12/nfcf-transceive-length/)
- [Complete list of APDU responses - EFTLab - Breakthrough Payment Technologies](https://www.eftlab.com/knowledge-base/complete-list-of-apdu-responses/)
- [PC/SCでFelica LiteにC言語でアクセスする - Qiita](https://qiita.com/gpsnmeajp/items/d4810b175189609494ac)
- [AndroidでFelica(NFC)のブロックデータの取得 - Qiita](https://qiita.com/nshiba/items/38f94d61c020a17314b6)
- [学生証をdumpしてみた - たつみのテックメモ](https://ta2mi.hatenablog.com/entry/2020/06/11/125631)
- [芝浦工業大学の学生証を読み取る | デジクリ](https://core.digicre.net/blog/article/83)
- [[felica] pasori を使って fcf フォーマットから ID，氏名を抽出する horiday blog](http://yasuke.org/horiyuki/blog/diary.cgi?Date=20090707)
- [PC/SCを用いてUnityから非接触型ICカードの情報を読み取る | 丸ノ内テックブログ](https://marunouchi-tech.i-studio.co.jp/5133/)
- [NFCFelicaReadSample/FelicaReader.cs at master · nobukuma/NFCFelicaReadSample](https://github.com/nobukuma/NFCFelicaReadSample/blob/master/StrawhatNet.NFC.FelicaReader/FelicaReader.cs)
- [hiro99ma blog: [felica]FeliCa Liteのデータを読む](https://blog.hirokuma.work/2012/03/felicafelica-lite.html)

## ツール

ココでいい感じに変換できます。
- [16進数バイナリ文字列変換 日本語変換 Online - DenCode](https://dencode.com/ja/string/hex)