import { StyleSheet } from "react-native";
import { themeColors } from "../theme/GlobalTheme";
import { rem } from "../utils/Responsive";

export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: rem(1.25),
    },
    text: {
        color: themeColors.primary,
        fontSize: rem(0.75),
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
});
