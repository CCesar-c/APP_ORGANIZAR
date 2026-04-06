// import { TouchableOpacity, Text } from "react-native";
// import { boton, titulo } from './estilo'

// function Boton({ onPress, children, style, ...props }) {
//     return (
//         <TouchableOpacity onPress={onPress} style={[boton, style, { alignItems: "center", justifyContent: "center", padding: 10 }]}  {...props} >
//             <Text style={{color:"white"}}>
//                 {children}
//             </Text>
//         </TouchableOpacity>
//     )
// }


// export { Boton };
// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar
} from "react-native";
import {
  useState
} from "react";
import {
  COLORS,
  FONTS
} from "./estilo";

function Divider( {
  style
}) {
  return (
    <View
      style={[{ height: 1, backgroundColor: COLORS.border, marginVertical: 4 },
        style,
      ]}
      />
  );
}

function Badge( {
  label, variant = "default"
}) {
  const variants = {
    default: {
      bg: COLORS.accentMuted,
      color: COLORS.accent
    },
      success: {
        bg: COLORS.successMuted,
        color: COLORS.success
      },
      danger: {
        bg: COLORS.dangerMuted,
        color: COLORS.danger
      },
      muted: {
        bg: COLORS.border,
        color: COLORS.textSecondary
      },
    };
    const v = variants[variant] || variants.default;
    return (
      <View
        style={ {
          backgroundColor: v.bg,
          borderRadius: 4,
          paddingHorizontal: 8,
          paddingVertical: 3,
        }}
        >
        <Text style={ { color: v.color, fontSize: 11, fontWeight: "700", letterSpacing: 0.8 }}>
          {label}
        </Text>
      </View>
    );
  }

  function PrimaryButton( {
    onPress, children, icon, variant = "primary", disabled
  }) {
    const bg =
    variant === "primary"
    ? COLORS.accent: variant === "danger"
    ? COLORS.danger: COLORS.border;
    const textColor = variant === "ghost" ? COLORS.textSecondary: COLORS.bg;

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.75}
        style={ {
          backgroundColor: "lightyellow",
          borderRadius: 6,
          paddingVertical: 12,
          paddingHorizontal: 18,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          opacity: disabled ? 0.5: 1,
        }}
        >
        {icon && (
          <Text style={ { fontSize: 14, color: textColor }}>{icon}</Text>
        )}
        <Text
          style={ {
            color: textColor,
            fontSize: 13,
            fontWeight: "700",
            letterSpacing: 0.5,
            ...FONTS.body,
          }}
          >
          {children}
        </Text>
      </TouchableOpacity>
    );
  }

  function IconButton( {
    onPress, icon, variant = "ghost"
  }) {
    const bg =
    variant === "danger"
    ? COLORS.dangerMuted: variant === "success"
    ? COLORS.successMuted: "transparent";
    const color =
    variant === "danger"
    ? COLORS.danger: variant === "success"
    ? COLORS.success: COLORS.textSecondary;

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={ {
          backgroundColor: bg,
          borderRadius: 6,
          width: 34,
          height: 34,
          alignItems: "center",
          justifyContent: "center",
        }}
        >
        <Text style={ { fontSize: 15, color }}>{icon}</Text>
      </TouchableOpacity>
    );
  }

  function StyledInput( {
    placeholder, value, onChangeText, keyboardType, maxLength, multiline
  }) {
    const [focused,
      setFocused] = useState(false);
    return (
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        multiline={multiline}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={ {
          backgroundColor: COLORS.surface,
          borderWidth: 1,
          borderColor: focused ? COLORS.accent: COLORS.border,
          borderRadius: 6,
          paddingHorizontal: 14,
          paddingVertical: 12,
          color: COLORS.text,
          fontSize: 14,
          ...FONTS.body,
          minHeight: multiline ? 80: undefined,
          textAlignVertical: multiline ? "top": "center",
        }}
        />
    );
  }

  function SectionHeader( {
    title, subtitle
  }) {
    return (
      <View style={ { marginBottom: 20 }}>
        <View style={ { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <View style={ { width: 3, height: 22, backgroundColor: COLORS.accent, borderRadius: 2 }} />
          <Text
            style={ {
              color: COLORS.text,
              fontSize: 20,
              ...FONTS.display,
              letterSpacing: 0.3,
            }}
            >
            {title}
          </Text>
        </View>
        {subtitle && (
          <Text style={ { color: COLORS.textSecondary, fontSize: 12, marginLeft: 13, letterSpacing: 0.3 }}>
            {subtitle}
          </Text>
        )}
      </View>
    );
  }

  function ScreenWrapper( {
    children
  }) {
    return (
      <View style={ { flex: 1, backgroundColor: COLORS.bg }}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
        {children}
      </View>
    );
  }

  export {
    Divider,
    Badge,
    PrimaryButton,
    IconButton,
    StyledInput,
    SectionHeader,
    ScreenWrapper
  };