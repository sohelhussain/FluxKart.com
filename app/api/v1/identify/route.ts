import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, phoneNumber } = await req.json();

  try {
    if (!email && !phoneNumber) {
      return NextResponse.json({ error: "Email or phoneNumber is required" }, { status: 400 });
    }

    let contact = await findExistingContact(email, phoneNumber);

    if (!contact) {
      contact = await prisma.contact.create({
        data: { email: email || null, phoneNumber: phoneNumber || null },
      });
    } else {
      contact = await updateContact(contact, email, phoneNumber);
    }

    const primaryContact = await findPrimaryContact(contact);
    const secondaryContacts = await prisma.contact.findMany({
      where: { linkedId: primaryContact.id },
    });

    const response = {
      contact: {
        primaryContatctId: primaryContact.id,
        emails: [primaryContact.email, ...secondaryContacts.map((c) => c.email).filter(Boolean)],
        phoneNumbers: [primaryContact.phoneNumber, ...secondaryContacts.map((c) => c.phoneNumber).filter(Boolean)],
        secondaryContactIds: secondaryContacts.map((c) => c.id),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error identifying contact:", error);
    return NextResponse.json({ error: "Failed to identify contact" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


async function findExistingContact(email: string | null | undefined, phoneNumber: string | null | undefined) {
  return await prisma.contact.findFirst({
    where: {
      OR: [
        { email: email || null },
        { phoneNumber: phoneNumber || null },
      ],
      AND: [
        { email: { not: null } },
        { phoneNumber: { not: null } }
      ]
    },
  });
}

async function updateContact(contact: any, email: string | null | undefined, phoneNumber: string | null | undefined) {

  if (contact.email === email && contact.phoneNumber === phoneNumber) return contact

  const existingContact = await findExistingContact(email, phoneNumber)

  if (!existingContact) {
    return await prisma.contact.create({
      data: {
        email: email || null,
        phoneNumber: phoneNumber || null,
        linkedId: contact.linkedId ?? contact.id,
        linkPrecedence: contact.linkedId ? "secondary" : "primary"
      },
    });
  }


  if (existingContact.id !== contact.id) {
    if (existingContact.linkPrecedence === "primary" && contact.linkPrecedence === "primary") {
      await prisma.contact.updateMany({
        where: { linkedId: contact.id },
        data: { linkedId: existingContact.id },
      });

      await prisma.contact.update({
        where: { id: contact.id },
        data: { linkedId: existingContact.id, linkPrecedence: "secondary" },
      });
    } else if (existingContact.linkPrecedence === 'primary' && contact.linkPrecedence === 'secondary') {
      await prisma.contact.update({
        where: { id: contact.id },
        data: { linkedId: existingContact.id },
      });
    }
    return existingContact;
  }
  return existingContact;
}

async function findPrimaryContact(contact: any) {
  if (contact.linkPrecedence === "primary") {
    return contact;
  }
  return await prisma.contact.findUnique({ where: { id: contact.linkedId } });
}
