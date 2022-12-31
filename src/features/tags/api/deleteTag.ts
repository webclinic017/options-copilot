import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabaseClient";

const deleteTag = async (tag_id: number) => {
  const { id: user_id } = supabase.auth.user();

  const { data, error } = await supabase.from("trade_tags").delete().match({
    tag_id,
    user_id,
  });
  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("No Tag Found");
  }

  return data;
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: number) => deleteTag(data).catch((err) => console.log(err)),
    {
      onSuccess: () => {
        queryClient.refetchQueries(["tradeTags"]);
      },
    }
  );
};
