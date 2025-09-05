# Routed Event

## Purpose

The reason for creating a dedicated `RoutedEvent` in Avalonia is that, standard CLR event can't propagate event upward(*bubble*) or downward(*tunnel*)

## RoutedEvent Definition

Similar to `AvaloniaProperty` (or specifically `StyledProperty`), Avalonia has registry for all `RoutedEvent`, and all `RoutedEvent` should be registered as static readonly field for specific owner type.
Avalonia has dedicated `Interactive.AddHandler` and `Interactive.RemoveHandler` wrappers for adding and removing handlers, which are operations applied on `Interactive._eventHandlers`

```cs
public partial class MainWindow : Window {
    public static readonly RoutedEvent<RoutedEventArgs> FooEvent =
        RoutedEvent.Register<MainWindow, RoutedEventArgs>(nameof(ValueChanged), RoutingStrategies.Bubble); // [!code highlight]

    public event EventHandler<RoutedEventArgs> ValueChanged {
        add => AddHandler(FooEvent, value); // [!code highlight]
        remove => RemoveHandler(FooEvent, value); // [!code highlight]
    }
    protected virtual void OnFoo() {
        // RoutedEventArgs requires event definition // [!code highlight]
        RoutedEventArgs args = new RoutedEventArgs(FooEvent); // [!code highlight]
        RaiseEvent(args);
    }
}
```

### Routing Modes

- `Bubble`: propagate upward
- `Tunnel`: propagate downward
- `Direct`: do not propagate(for owner control only)

## RoutedEvent Identity & Storage

Each `Interactive` has dedicated dictionary for storing events by `RoutedEvent` definition, this is much simpler than how `AvaloniaObject` manage its `StyledProperty` since events doesn't have a complex system to manage the priority or something else.

```cs
public class Interactive : Layoutable {
    /** ... **/
    private Dictionary<RoutedEvent, List<EventSubscription>>? _eventHandlers; // [!code highlight]
    /** ... **/
}
```

Static `RoutedEvent` definitions are stored in `RoutedEventRegistry.Instance`

```cs
// query all RoutedEvent from owner type
_ = RoutedEventRegistry.Instance.GetRegistered<MainWindow>();
```

## RoutedEventArgs

- `Handled`: indicating whether the event has been handled by any control along the visual tree.
- `RoutedEvent`: used as an index to trigger the event in controls along the visual tree.

```cs
public class RoutedEventArgs : EventArgs {
    /// <summary>
    /// Gets or sets a value indicating whether the routed event has already been handled.
    /// </summary>
    /// <remarks>
    /// Once handled, a routed event should be ignored.
    /// </remarks>
    public bool Handled { get; set; }

    /// <summary>
    /// Gets or sets the routed event associated with these event args.
    /// </summary>
    public RoutedEvent? RoutedEvent { get; set; }

    /// <summary>
    /// Gets or sets the routing strategy (direct, bubbling, or tunneling) of the routed event.
    /// </summary>
    public RoutingStrategies Route { get; set; }

    /// <summary>
    /// Gets or sets the source object that raised the routed event.
    /// </summary>
    public object? Source { get; set; }
}
```


## Class Handler

Class handlers are event handlers for `RoutedEvent` **with highest priority**, which means class handlers will always be invoked **before** any other handlers.
It is class-specific, usually registered in a static constructor using `RoutedEvent.AddClassHandler<TTarget>`.
`InputElement` class has registered most of default class handlers such as `InputElement.OnPointerPressed(PointerPressedEventArgs e)`, developers can override such empty methods to manage the default behaviour of an `RoutedEvent`.

```cs
public class InputElement : Interactive, IInputElement {
    /** ... **/
    static InputElement() {
        /** ... **/
        KeyDownEvent.AddClassHandler<InputElement>((x, e) => x.OnKeyDown(e));
        KeyUpEvent.AddClassHandler<InputElement>((x, e) => x.OnKeyUp(e));
        TextInputEvent.AddClassHandler<InputElement>((x, e) => x.OnTextInput(e));
        PointerEnteredEvent.AddClassHandler<InputElement>((x, e) => x.OnPointerEnteredCore(e));
        PointerExitedEvent.AddClassHandler<InputElement>((x, e) => x.OnPointerExitedCore(e));
        PointerMovedEvent.AddClassHandler<InputElement>((x, e) => x.OnPointerMoved(e));
        PointerPressedEvent.AddClassHandler<InputElement>((x, e) => x.OnPointerPressed(e)); // [!code highlight]
        PointerReleasedEvent.AddClassHandler<InputElement>((x, e) => x.OnPointerReleased(e));
        PointerCaptureLostEvent.AddClassHandler<InputElement>((x, e) => x.OnPointerCaptureLost(e));
        PointerWheelChangedEvent.AddClassHandler<InputElement>((x, e) => x.OnPointerWheelChanged(e));
        /** ... **/
    }

    public event EventHandler<PointerPressedEventArgs>? PointerPressed {
        add { AddHandler(PointerPressedEvent, value); }
        remove { RemoveHandler(PointerPressedEvent, value); }
    }

    public static readonly RoutedEvent<PointerPressedEventArgs> PointerPressedEvent =
        RoutedEvent.Register<InputElement, PointerPressedEventArgs>(
            nameof(PointerPressed),
            RoutingStrategies.Tunnel | RoutingStrategies.Bubble);

    // default empty class handler to be overridden
    protected virtual void OnPointerPressed(PointerPressedEventArgs e) { } // [!code highlight]

    /** ... **/
}
```

## Attached Event

Similar to `AttachedProperty`, attached event are external definition for a `TOwner`(typically a static class)
However, there's no dedicated type for attached event, attached events are still presented as `RoutedEvent`.

```cs
public static class Gestures {
    /** ... **/
    public static readonly RoutedEvent<TappedEventArgs> TappedEvent = RoutedEvent.Register<TappedEventArgs>(
        "Tapped",
        RoutingStrategies.Bubble,
        typeof(Gestures));
    /** ... **/
}
```
