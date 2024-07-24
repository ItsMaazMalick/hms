"use server";

import prisma from "@/lib/db";
import {
  addAmountSchema,
  assignBedSchema,
  checkoutSchema,
  extendDateSchema,
} from "@/lib/schemas/assign-bed-schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function assignBed(
  values: z.infer<typeof assignBedSchema>,
  totalPayment: number,
  role: string,
  id: string
) {
  const validData = assignBedSchema.safeParse(values);
  if (!validData?.success) {
    return { error: "Invalid data provided" };
  }
  const { startDate, endDate, advancePayment, bed, challanNumber } =
    validData.data;

  try {
    const existingChallan = await prisma.challan.findUnique({
      where: { challanNumber },
    });
    if (existingChallan) {
      return { error: "Receipt Number already exists" };
    }
    if (role === "student") {
      const existingStudent = await prisma.studentRegistration.findUnique({
        where: { id },
      });
      if (!existingStudent) {
        return { error: "No student found" };
      }
      const assignBed = await prisma.bedAssign.create({
        data: {
          startDate,
          endDate,
          totalPayment,
          bed: {
            connect: { id: bed },
          },
          student: {
            connect: { id },
          },
        },
      });
      await prisma.bed.update({
        where: { id: bed },
        data: {
          isAvailable: false,
        },
      });
      await prisma.challan.create({
        data: {
          challanNumber,
          amount: advancePayment,
          bedAssignId: assignBed.id,
        },
      });
      await prisma.studentRegistration.update({
        where: { id: existingStudent.id },
        data: {
          isBooked: true,
        },
      });
      revalidatePath("/dashboard/assign-bed");
      return { success: "Data saved successfully" };
    }

    if (role === "guest") {
      const existingGuest = await prisma.guestRegistration.findUnique({
        where: { id },
      });
      if (!existingGuest) {
        return { error: "No student found" };
      }
      const assignBed = await prisma.bedAssign.create({
        data: {
          startDate,
          endDate,
          totalPayment,
          bed: {
            connect: {
              id: bed,
            },
          },
          guest: {
            connect: { id },
          },
        },
      });
      await prisma.bed.update({
        where: { id: bed },
        data: {
          isAvailable: false,
        },
      });
      await prisma.challan.create({
        data: {
          challanNumber,
          amount: advancePayment,
          bedAssignId: assignBed.id,
        },
      });
      await prisma.guestRegistration.update({
        where: { id: existingGuest.id },
        data: {
          isBooked: true,
        },
      });
      revalidatePath("/dashboard/assign-bed");
      return { success: "Data saved successfully" };
    }
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
}

export async function getRecentBookings() {
  try {
    const bookings = await prisma.bedAssign.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        challans: true,
        student: {
          select: {
            id: true,
            fullName: true,
          },
        },
        guest: {
          select: {
            id: true,
            fullName: true,
          },
        },
        bed: {
          select: {
            id: true,
            name: true,
            room: {
              select: {
                id: true,
                name: true,
                floor: {
                  select: {
                    id: true,
                    name: true,
                    hall: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return bookings;
  } catch (error) {
    return null;
  }
}

export async function getRecentBookingsByHall(id: string) {
  try {
    const bookings = await prisma.hall.findUnique({
      where: {
        id,
      },
      include: {
        floors: {
          select: {
            id: true,
            name: true,
            rooms: {
              select: {
                id: true,
                name: true,
                bed: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    bedAssign: {
                      include: {
                        challans: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    return bookings;
  } catch (error) {
    return null;
  }
}

export async function getAssignBed(id: string) {
  try {
    const bed = await prisma.bedAssign.findUnique({
      where: { id },
      include: {
        challans: true,
        student: true,
        guest: true,
        bed: true,
      },
    });
    return bed;
  } catch (error) {
    return null;
  }
}

export async function getBookingDetail(id: string) {
  try {
    const bed = await prisma.bedAssign.findUnique({
      where: { id },
      include: {
        challans: true,
        student: true,
        guest: true,
        bed: {
          select: {
            name: true,
            room: {
              select: {
                name: true, // Select the name of the room
                floor: {
                  select: {
                    name: true, // Select the name of the floor
                    hall: {
                      select: {
                        name: true, // Select the name of the hall
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    return bed;
  } catch (error) {
    return null;
  }
}

export async function extendDate(
  values: z.infer<typeof extendDateSchema>,
  totalPayment: number,
  id: string
) {
  const validData = extendDateSchema.safeParse(values);
  if (!validData?.success) {
    return { error: "Invalid data provided" };
  }
  const { endDate, advancePayment, challanNumber } = validData.data;

  try {
    const existingBedAssign = await prisma.bedAssign.findUnique({
      where: { id },
    });
    if (!existingBedAssign) {
      return { error: "Invalid id provided" };
    }
    const existingChallan = await prisma.challan.findUnique({
      where: { challanNumber },
    });
    if (existingChallan) {
      return { error: "Receipt Number already exists" };
    }
    const bedAssign = await prisma.bedAssign.update({
      where: { id },
      data: {
        endDate,
        totalPayment: totalPayment + existingBedAssign.totalPayment,
      },
    });
    await prisma.challan.create({
      data: {
        challanNumber,
        amount: advancePayment,
        bedAssignId: bedAssign.id,
      },
    });
    revalidatePath("/dashboard");
    return { success: "Data updated successfully" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

// ADD AMOUNT
export async function addAmount(
  values: z.infer<typeof addAmountSchema>,
  id: string
) {
  const validData = addAmountSchema.safeParse(values);
  if (!validData?.success) {
    return { error: "Invalid data provided" };
  }
  const { amount, challanNumber } = validData.data;

  try {
    const existingBedAssign = await prisma.bedAssign.findUnique({
      where: { id },
    });
    if (!existingBedAssign) {
      return { error: "Invalid id provided" };
    }

    const existingChallan = await prisma.challan.findUnique({
      where: { challanNumber },
    });
    if (existingChallan) {
      return { error: "Receipt Number already exists" };
    }

    await prisma.challan.create({
      data: {
        challanNumber,
        amount,
        bedAssignId: existingBedAssign.id,
      },
    });
    revalidatePath("/dashboard");
    return { success: "Data updated successfully" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
}

export async function checkout(
  values: z.infer<typeof checkoutSchema>,
  id: string
) {
  const validData = checkoutSchema.safeParse(values);
  if (!validData?.success) {
    return { error: "Invalid data provided" };
  }
  const { payment, checkoutDate, challanNumber } = validData.data;
  try {
    const existingBedAssign = await prisma.bedAssign.findUnique({
      where: { id },
      include: {
        bed: true,
      },
    });
    if (!existingBedAssign) {
      return { error: "No record found!" };
    }

    const existingChallan = await prisma.challan.findUnique({
      where: { challanNumber },
    });
    if (existingChallan) {
      return { error: "Receipt Number already exists" };
    }

    const bedAssign = await prisma.bedAssign.update({
      where: { id },
      data: {
        endDate: checkoutDate,
        isClosed: true,
      },
    });
    await prisma.bed.update({
      where: { id: existingBedAssign.bed.id },
      data: {
        isAvailable: true,
      },
    });
    await prisma.challan.create({
      data: {
        challanNumber: challanNumber,
        amount: payment,
        bedAssignId: bedAssign.id,
      },
    });
    if (existingBedAssign.studentId) {
      await prisma.studentRegistration.update({
        where: { id: existingBedAssign.studentId },
        data: {
          isBooked: false,
        },
      });
    }
    if (existingBedAssign.guestId) {
      await prisma.guestRegistration.update({
        where: { id: existingBedAssign.guestId },
        data: {
          isBooked: false,
        },
      });
    }

    revalidatePath("/dashboard");
    return { success: "Successfully Checkout" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function getAllocatedRooms() {
  try {
    const allocatedRooms = await prisma.bedAssign.findMany({
      where: { isClosed: false },
    });
    return allocatedRooms;
  } catch (error) {
    return null;
  }
}
