import api from "@/lib/api";
import { User, UserCreateData } from "../data/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";



const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>('/users');
  return data;
}

const createUser = async (user: UserCreateData): Promise<User> => {
  const { data } = await api.post<User>('/users', user);
  return data;
}

const updateUser = async (id: number, user: UserCreateData): Promise<User> => {
  const { data } = await api.put<User>(`/users/${id}`, user);
  return data;
}

const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
}

export const useUsersData = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['users']});
    },
    onError: (error) => {
      toast.error(`error no criar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { id: number, user: UserCreateData }) => 
      updateUser(params.id, params.user),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['users']});
    },
    onError: (error) => {
      toast.error(`error ao atualizar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  })
}


export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['users']});
    },
    onError: (error) => {
      toast.error(`error ao deletar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  })
}


export const useUploadProfilePicture = () => {
  return useMutation({
    mutationFn: async({id, file}: { id: number, file: File }) => {
      const formData = new FormData();
      formData.append('profilePicture', file);
      const response = await api.patch(`/users/${id}/picture`, formData)
      if (response.status === 200) {
        throw new Error('Failed to upload profile picture');
      }
      return response.data;
    }
  })
}






