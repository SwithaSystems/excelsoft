import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";

interface PromotionCardProps {
  image: string | number;
  title: string;
  isLive?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onRemoveLive?: () => void;
  onGoLive?: () => void;
  canGoLive?: boolean;
}

const PromotionCard: React.FC<PromotionCardProps> = ({
  image,
  title,
  isLive = false,
  onEdit,
  onDelete,
  onRemoveLive,
  onGoLive,
  canGoLive = true,
}) => {
  return (
    <View style={styles.card}>
      {/* Image */}
      <Image
        source={typeof image === "string" ? { uri: image } : image}
        style={styles.image}
        resizeMode="cover"
      />

      {/* ================= LIVE CARD ================= */}
      {isLive ? (
        <View style={styles.liveActionBar}>
          <TouchableOpacity
            style={styles.removeLiveBtn}
            onPress={onRemoveLive}
            activeOpacity={0.7}
          >
            <Text style={styles.removeLiveText}>Remove Live</Text>
          </TouchableOpacity>

          <View style={styles.rightActions}>
            <TouchableOpacity
              style={styles.iconTextBtn}
              onPress={onEdit}
              activeOpacity={0.7}
            >
              <Ionicons
                name="create-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconTextBtn}
              onPress={onDelete}
              activeOpacity={0.7}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={colors.error}
              />
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* ================= NOT LIVE CARD ================= */
        <View style={styles.infoSection}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>

          <View style={styles.bottomRow}>
            {/* Show Go Live button only if canGoLive is true */}
            {canGoLive ? (
              <TouchableOpacity style={styles.goLiveBtn} onPress={onGoLive}>
                <View style={styles.liveDot} />
                <Text style={styles.goLiveText}>Go Live</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.disabledGoLiveBtn}>
                <View style={styles.disabledLiveDot} />
                <Text style={styles.disabledGoLiveText}>Go Live</Text>
              </View>
            )}

            <View style={styles.rightActions}>
              <TouchableOpacity style={styles.iconTextBtn} onPress={onEdit}>
                <Ionicons name="create-outline" size={18} color={colors.primary} />
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconTextBtn} onPress={onDelete}>
                <Ionicons name="trash-outline" size={18} color={colors.error} />
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default PromotionCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
    marginBottom: 16,
  },

  image: {
    width: "100%",
    height: 180,
  },

  /* ===== LIVE CARD ===== */

  liveActionBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },

  removeLiveBtn: {
    paddingVertical: 6,
  },

  removeLiveText: {
    color: colors.error,
    fontWeight: "600",
    fontSize: 14,
  },

  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    gap: 24,
  },

  /* ===== NOT LIVE CARD ===== */

  infoSection: {
    padding: 16,
    backgroundColor: colors.white,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.black,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  goLiveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  goLiveText: {
    color: colors.white,
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },

  /* ===== DISABLED GO LIVE BUTTON ===== */

  disabledGoLiveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.placeholdergrey,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    opacity: 0.6,
  },

  disabledGoLiveText: {
    color: colors.darkGray || "#666",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
  },

  disabledLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.darkGray || "#666",
  },

  iconTextBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    ...(Platform.OS === "web" && {
      cursor: "pointer",
    }),
  },

  editText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },

  deleteText: {
    color: colors.error,
    fontWeight: "600",
    fontSize: 14,
  },
});