import ru from "./messages/ru.json";

type Messages = typeof ru;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages {}
}
