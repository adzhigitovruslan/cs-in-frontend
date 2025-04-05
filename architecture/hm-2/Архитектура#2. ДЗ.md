# ДЗ к лекции Архитектура#2

## Кастомный toString

Необходимо сделать конкретному массиву метод toString, который возвращает первый элемент .. последний.

```js
// 1..4
addToString([1, 2, 3, 4]).toString();

// 1
addToString([1]).toString();

//
addToString([]).toString();
```

## Расширить объект-обертку строки (String.prototype)

Необходимо добавить все строкам в JavaScript метод capitalize, который делает первую букву в строке заглавной.

```js
"foo".capitalize(); // Foo
```