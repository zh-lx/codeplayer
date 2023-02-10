# customPinyin <Badge type="tip" text="v3.4.0+" vertical="middle" />

`pinyin-pro` 内部导出了 `customPinyin` 方法，支持用户自定义设置词句拼音，当中文中匹配用户自己定义的词句拼音时，优先使用用户自定义的拼音。

## 示例

### 不使用自定义拼音

涉及到多音字时，部分复杂拼音或者人名等，可能识别不准确，例如你有个人名叫 `张会(zhāng kuài)`

```js
import { pinyin } from 'pinyin-pro';

pinyin('他叫张会'); // 'tā jiào zhāng huì'
```

### 使用自定义拼音

使用 `customPinyin` 方法，会优先使用用户自定义的拼音。

```js
import { pinyin, customPinyin } from 'pinyin-pro';

customPinyin({
  张会: 'zhāng kuài',
});

pinyin('他叫张会'); // 'tā jiào zhāng kuài'
```

## 语法及参数

### 语法

```ts
import { customPinyin } from 'pinyin-pro';

interface PinyinMap {
  [key: string]: string;
}

customPinyin(map: PinyinMap);
```

### 参数

- `map` (必传)：object 类型，自定义的拼音映射，key 为汉字字符串，value 为独赢的拼音。
