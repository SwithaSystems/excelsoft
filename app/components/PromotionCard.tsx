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
  title?: string;
  url?: string;

  showTitle?: boolean;
  showLink?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  deleteButtonText?: string;

  backgroundColor?: string;

  onEdit?: () => void;
  onDelete?: () => void;

  cardStyle?: any;
  imageStyle?: any;
}

const PromotionCard: React.FC<PromotionCardProps> = ({
  image,
  title,
  url,
  showTitle = true,
  showLink = true,
  showEditButton = true,
  showDeleteButton = true,
  deleteButtonText = "Delete",
  backgroundColor = colors.secondary,
  onEdit,
  onDelete,
  cardStyle,
  imageStyle,
}) => {
  return (
    <View style={[styles.card, cardStyle]}>
      {/* Image */}
      <Image
        source={typeof image === "string" ? { uri: image } : image}
        style={[styles.image, imageStyle]}
        resizeMode="cover"
      />

      {/* Content */}
      <View style={[styles.infoSection, { backgroundColor }]}>
        {/* Title & URL */}
        <View>
          {showTitle && title && (
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
          )}

          {showLink && url && (
            <View style={styles.urlRow}>
              <Ionicons name="link-outline" size={16} color={colors.black} />
              <Text style={styles.urlText} numberOfLines={1}>
                {url}
              </Text>
            </View>
          )}
        </View>

        {/* Actions – bottom right */}
        <View style={styles.actionsRow}>
          {showEditButton && onEdit && (
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
          )}

          {showDeleteButton && onDelete && (
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
              <Text style={styles.deleteText}>{deleteButtonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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

  infoSection: {
    padding: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 6,
  },

  urlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  urlText: {
    fontSize: 14,
    color: colors.black,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    marginTop: 16,
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
